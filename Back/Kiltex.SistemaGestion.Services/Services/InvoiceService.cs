using AutoMapper;
using DocumentFormat.OpenXml.Office2013.Excel;
using DocumentFormat.OpenXml.Spreadsheet;
using Kiltex.SistemaGestion.Domain;
using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.SDK.Error;
using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.ImpresoraFiscal;
using Kiltex.SistemaGestion.Services.ImpresoraFiscal.Printer250F;
using Kiltex.SistemaGestion.Services.LibroIvaDigital;
using Kiltex.SistemaGestion.Services.LibrosIvaDigital;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Text.RegularExpressions;

namespace Kiltex.SistemaGestion.Services.Services
{
    public class InvoiceService : BaseService
    {
        private readonly PrinterStatus _config;
        private readonly IPrinter _printer;
        public InvoiceService(ErrorManager logger, DBContext context, IMapper maper, IPrinter printer, PrinterStatus config, IConfiguration configuration) :
            base(logger, context, maper, configuration)
        {
            _config = config;
            _printer = printer;
        }
        public async Task<OperationResponse<DtoRequestInvoice>> GetById(long id)
        {
            try
            {
                var factura = await _contextSql
                                   .Invoices
                                   .Include(x => x.InvoiceDetails)
                                   .AsNoTracking()
                                   .FirstOrDefaultAsync(p => p.Id == id)
                                   .ConfigureAwait(false);
                if (factura == null)
                {
                    _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                    return Error<DtoRequestInvoice>(new OperationExceptions("000", $"Factura no encontrada {id}"));
                }

                var result = _mapper.Map<DtoRequestInvoice>(factura);

                result.Iva10 = 0;
                result.Iva21 = 0;
                result.Iva27 = 0;
                foreach (var item in result.InvoiceDetails)
                {
                    result.Iva10 += ((decimal)item.Iva == (decimal)10.5) ? (item.Quantity * item.Price) - (item.Quantity * item.Price) / 1.105m : 0;
                    result.Iva21 += ((decimal)item.Iva == (decimal)21) ? (item.Quantity * item.Price) - (item.Quantity * item.Price) / 1.21m : 0;
                    result.Iva27 += ((decimal)item.Iva == (decimal)27) ? (item.Quantity * item.Price) - (item.Quantity * item.Price) / 1.27m : 0;
                }
                return new OperationResponse<DtoRequestInvoice>(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }
        }

        public async Task<OperationResponse<IdResponse<long>>> NewInvoice(DtoRequestInvoice model, CancellationToken ct = default)
        {
            try
            {
                model.Id = 0;                
                return await AddOrUpdate(model, ct).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }
        }

        public async Task<OperationResponse<DtoPagination<DtoRequestInvoice>>> ListInvoices(RequestPaginatedData<SpecificFilter> request)
        {
            try
            {
                var query = _contextSql
                                    .Invoices
                                    .AsNoTracking()
                                    .Include(p => p.InvoiceDetails)
                                    .Where(p => (!string.IsNullOrEmpty(request.Filter.Cuit) ? p.CustomerCuit.ToLower().Contains(request.Filter.Cuit) : true)
                                     && ((request.Filter.Number.HasValue && request.Filter.Number != 0) ? p.InvoiceNumber == request.Filter.Number : true)
                                     &&
                                     ((!request.Filter.Date.Contains("") || request.Filter.Date != null) ? p.DateTime.Date.ToString().Contains(request.Filter.Date) : true)
                                     &&
                                     (!string.IsNullOrEmpty(request.Filter.CustomerName) ? p.CustomerName.ToLower().Contains(request.Filter.CustomerName) : true)
                                     );

                var count = await query.CountAsync().ConfigureAwait(false);

                var list = await query.OrderByDescending(p => p.DateTime)
                                      .Skip(request.Page * request.PageSize)
                                      .Take(request.PageSize)
                                      .ToListAsync()
                                      .ConfigureAwait(false);

                var result = _mapper.Map<List<DtoRequestInvoice>>(list);


                return new OperationResponse<DtoPagination<DtoRequestInvoice>>(new DtoPagination<DtoRequestInvoice>
                {
                    Data = result,
                    PageSize = request.PageSize,
                    TotalCount = count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }
        }

        public async Task<OperationResponse<IdResponse<long>>> AddOrUpdate(DtoRequestInvoice model, CancellationToken ct = default)
        {
            var transaction = _contextSql.Database.BeginTransaction();
            var invoiceModel = _mapper.Map<Invoice>(model);
            var newProduct = new Product();
            try
            {
                if (invoiceModel.Id == 0)
                {
                    if (invoiceModel.CustomerId == 0)
                    {
                        var user = await _contextSql.Customers.AsNoTracking().FirstOrDefaultAsync(p => p.Name.ToLower() == "admin");
                        invoiceModel.CustomerId = user.Id;
                    }

                    var regex = new Regex(@"^-?[0-9][0-9,\.]+$");


                    foreach (var detail in invoiceModel.InvoiceDetails)
                    {
                        if (detail.ProductId > 0)
                        {
                            var oldProduct = await _contextSql.Products.FirstAsync(p => p.Id == detail.ProductId).ConfigureAwait(false);

                            newProduct = oldProduct;
                            newProduct.UpdateStock(-detail.Quantity);
                            _contextSql.Products.Update(newProduct);
                        }
                        if (detail.ProductId < 0)
                        {
                            detail.ProductId = -1;
                        }
                    }

                    if (_config.Status)
                    {
                        #region VERIFICACIONES
                        //Verifico que el DNI O CUIT no tenga letras
                        if (!regex.IsMatch(model.CustomerCuit))
                        {
                            _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                            return Error<IdResponse<long>>(new OperationExceptions("000", "Error al cargar cliente, El CUIT/DNI tiene que ser numerico"));
                        }
                        //Verifico que el CUIT O DNI no se pasen de los parametros
                        if (model.CustomerCuit.Length > 11 || model.CustomerCuit.Length < 7)
                        {
                            _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                            return Error<IdResponse<long>>(new OperationExceptions("000", "Error al cargar cliente, verifique cantidad de digitos"));
                        }

                        //Verfico que la factura A no pueda realizarse al colocar un DNI
                        if (model.Type == 1 && model.CustomerCuit.Length != 11)
                        {
                            _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                            return Error<IdResponse<long>>(new OperationExceptions("000", "Error al cargar cliente, no puede cargar un DNI con Factura tipo A"));
                        }
                        //Verifico que el DNI tenga mayor a 7 caracteres y menor a 9
                        if (model.Type == 2 && model.CustomerCuit.Length < 7 || model.CustomerCuit.Length > 9 && model.CustomerCuit.Length != 11)
                        {
                            _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                            return Error<IdResponse<long>>(new OperationExceptions("000", "Error al cargar cliente, verifique DNI"));
                        }
                        #endregion

                        var error = await PrintInvoice(invoiceModel, ct);

                        #region ERRORES

                        if (error == "ErrorCliente")
                        {
                            _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                            return Error<IdResponse<long>>(new OperationExceptions("000", "Error al cargar cliente, compruebe el CUIT/DNI"));
                        }

                        if (error == "ErrorAbrir")
                        {
                            _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                            return Error<IdResponse<long>>(new OperationExceptions("000", "Error al abrir documento , intente nuevamente"));
                        }

                        if (error == "ErrorImprimir")
                        {
                            _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                            return Error<IdResponse<long>>(new OperationExceptions("000", "Error al imprimir item, intente con un cierre Z"));
                        }

                        if (error == "ErrorCerrar")
                        {
                            _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                            return Error<IdResponse<long>>(new OperationExceptions("000", "Error al cerrar documento, intente con un cierre Z"));
                        }


                        #endregion

                        invoiceModel.InvoiceNumber = long.Parse(error);
                    }

                    await _contextSql.Invoices.AddAsync(invoiceModel, ct).ConfigureAwait(false);
                }

                await _contextSql.SaveChangesAsync(ct).ConfigureAwait(false);
                transaction.Commit();
                return Ok(new IdResponse<long>(invoiceModel.Id));
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                return Error<IdResponse<long>>(new OperationExceptions(ErrorsCodes.C_999_ERROR_GENERICO, ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO)));
            }
        }

        public async Task<OperationResponse<IEnumerable<DtoResponseInvoiceReportTotals>>> InvoiceReport(RequestPaginatedData<StoredProcedureFilter> request)
        {
            var dateFromParameter = new SqlParameter("@dateFrom", request.Filter.DateFrom.HasValue ? (object)request.Filter.DateFrom.Value : (object)DBNull.Value);
            var dateToParameter = new SqlParameter("@dateTo", request.Filter.DateTo.HasValue ? (object)request.Filter.DateTo.Value : (object)DBNull.Value);
            var categoryParameter = new SqlParameter("@categoryId", (request.Filter.CategoryId == 0 || !request.Filter.CategoryId.HasValue) ? (object)DBNull.Value : request.Filter.CategoryId.Value);

            string invoiceSPname = StoredProcedure.INVOICEREPORTS;
            string invoiceRPTname = StoredProcedure.INVOICEREPORTSTOTAL;
            try
            {
                var invoices = await _contextSql.InvoiceSPReports
                .FromSqlRaw($"EXEC {invoiceSPname} @dateFrom, @dateTo, @categoryId", dateFromParameter, dateToParameter, categoryParameter)
                .ToListAsync();

                var invoiceReportTotal = await _contextSql.InvoiceSPReportTotals
                .FromSqlRaw($"EXEC {invoiceRPTname} @dateFrom, @dateTo, @categoryId", dateFromParameter, dateToParameter, categoryParameter)
                .ToListAsync();
                
                if ((invoices == null || invoiceReportTotal == null) || (!invoices.Any() || !invoiceReportTotal.Any()))
                {
                    return Error<IEnumerable<DtoResponseInvoiceReportTotals>>(new OperationExceptions("000", $"El reporte no encontro registros"));
                }
                List<DtoResponseInvoiceReportTotals> invoiceReportTotals = _mapper.Map<List<DtoResponseInvoiceReportTotals>>(invoiceReportTotal);
                List<DtoResponseInviocesReport> invoiceReport = _mapper.Map<List<DtoResponseInviocesReport>>(invoices);


                foreach (var item in invoiceReportTotals)
                {
                    item.InvoicesReports = new List<DtoResponseInviocesReport>();

                    item.InvoicesReports = invoiceReport.Where(y => y.Date.Date == item.InvoiceDate.Value).ToList();
                }

                return new OperationResponse<IEnumerable<DtoResponseInvoiceReportTotals>>(invoiceReportTotals);
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                return Error<IEnumerable<DtoResponseInvoiceReportTotals>>(new OperationExceptions(ErrorsCodes.C_999_ERROR_GENERICO, ex?.Message.ToString()));

            }
        }

        #region Alicuota Digital

        public async Task<OperationResponse<byte[]>> AlicuotaTxt(DateTime from, DateTime to, CancellationToken ct = default)
        {
            var query = await _contextSql
                           .Invoices
                           .Include(s => s.InvoiceDetails)
                           .AsNoTracking()
                           .Where(x => x.DateTime.Date >= from && x.DateTime.Date <= to).ToArrayAsync();


            StringWriter OutPutFile = new StringWriter();
            List<AlicuotaIvaDto> alicuotaIvaDtos = new List<AlicuotaIvaDto>();
            try
            {

                MemoryStream ms = new MemoryStream();
                TextWriter tw = new StreamWriter(ms);

                foreach (Invoice item in query)
                {
                    decimal totalIva10 = 0;
                    decimal totalBaseIva10 = 0;
                    decimal totalIva21 = 0;
                    decimal totalBaseIva21 = 0;
                    decimal totalIva27 = 0;                    
                    decimal totalBaseIva27 = 0;

                    // Variables para facturas B con iva incluido
                    decimal totalIva10B = 0;
                    decimal totalBaseIva10B = 0;
                    decimal totalIva21B = 0;
                    decimal totalBaseIva21B = 0;
                    decimal totalIva27B = 0;                    
                    decimal totalBaseIva27B = 0;                    

                    foreach (InvoiceDetail invoiceDetail in item.InvoiceDetails)
                    {
                        if (item.Type == (int)ETypeReceipt.A)
                        {
                            #region Importe Liquidado (total de iva)
                            totalIva10 += ((decimal)invoiceDetail.Iva == (decimal)10.5) ? (invoiceDetail.Quantity * invoiceDetail.Price) - (invoiceDetail.Quantity * invoiceDetail.Price) / 1.105m : 0;
                            totalBaseIva10 += ((decimal)invoiceDetail.Iva == (decimal)10.5) ? (invoiceDetail.Quantity * invoiceDetail.Price) : 0;

                            totalIva21 += ((decimal)invoiceDetail.Iva == (decimal)21) ? (invoiceDetail.Quantity * invoiceDetail.Price) - (invoiceDetail.Quantity * invoiceDetail.Price) / 1.21m : 0;
                            totalBaseIva21 += ((decimal)invoiceDetail.Iva == (decimal)21) ? (invoiceDetail.Quantity * invoiceDetail.Price) : 0;

                            totalIva27 += ((decimal)invoiceDetail.Iva == (decimal)27) ? (invoiceDetail.Quantity * invoiceDetail.Price) - (invoiceDetail.Quantity * invoiceDetail.Price) / 1.27m : 0;
                            totalBaseIva27 += ((decimal)invoiceDetail.Iva == (decimal)27) ? (invoiceDetail.Quantity * invoiceDetail.Price) : 0;
                            #endregion
                        }
                        if (item.Type == (int)ETypeReceipt.B || item.Type == (int)ETypeReceipt.EXENTO)
                        {
                            totalBaseIva10B += ((decimal)invoiceDetail.Iva == (decimal)10.5) ? (invoiceDetail.Quantity * invoiceDetail.Price) : 0;

                            totalBaseIva21B += ((decimal)invoiceDetail.Iva == (decimal)21) ? (invoiceDetail.Quantity * invoiceDetail.Price) : 0;

                            totalBaseIva27B += ((decimal)invoiceDetail.Iva == (decimal)27) ? (invoiceDetail.Quantity * invoiceDetail.Price) : 0;
                        }
                     }
                    
                    if (totalIva10 > 0m || totalBaseIva10B > 0m) 
                    {

                        AlicuotaIvaDto alicuotaIva = new AlicuotaIvaDto();

                        #region Condicionales Tipo Factura
                        if (item.Type == (int)ETypeReceipt.B || item.Type == (int)ETypeReceipt.EXENTO)
                        {
                            alicuotaIva.TipoDecComprobante = CustomizationConstant.FacturaB;

                            #region Importe neto gravado (SIN COMA)
                            var netogravado = Math.Round((totalBaseIva10B / 1.105m), 2);
                            alicuotaIva.ImporteNetoGravado = netogravado.ToString().Replace(",", "").Replace(".", "");
                            alicuotaIva.ImporteNetoGravado = alicuotaIva.ImporteNetoGravado.PadLeft(15, '0');
                            #endregion

                            #region Impuesto Liquidado
                            var impuestoLiquidado = Math.Round((netogravado * 0.105m),2);
                            alicuotaIva.ImpuestoLiquidado = impuestoLiquidado.ToString("F2").Replace(",", "").Replace(".", "");
                            alicuotaIva.ImpuestoLiquidado = alicuotaIva.ImpuestoLiquidado.PadLeft(15, '0');
                            #endregion
                        }

                        if (item.Type == (int)ETypeReceipt.A)
                        {
                            alicuotaIva.TipoDecComprobante = CustomizationConstant.FacturaA;

                            #region Importe neto gravado (SIN COMA)
                            var subtotal = totalBaseIva10 - Math.Round(totalIva10, 2);
                            alicuotaIva.ImporteNetoGravado = subtotal.ToString().Replace(",", "").Replace(".", "");
                            alicuotaIva.ImporteNetoGravado = alicuotaIva.ImporteNetoGravado.PadLeft(15, '0');
                            #endregion

                            #region Impuesto Liquidado
                            alicuotaIva.ImpuestoLiquidado = totalIva10.ToString("F2").Replace(",", "").Replace(".", "");
                            alicuotaIva.ImpuestoLiquidado = alicuotaIva.ImpuestoLiquidado.PadLeft(15, '0');
                            #endregion
                        }
                        #endregion

                        #region Numero de Comprobante
                        alicuotaIva.NumeroDeComprobante = item.InvoiceNumber.ToString().PadLeft(20, '0');
                        #endregion
                                                
                        #region Condicionales Iva
                        
                        alicuotaIva.AlicuotaIva = "4";

                        #endregion

                        alicuotaIvaDtos.Add(alicuotaIva);
                    }
                    
                    if (totalIva21 > 0m || totalBaseIva21B > 0m) 
                    {
                        AlicuotaIvaDto alicuotaIva = new AlicuotaIvaDto();

                        #region Condicionales Tipo Factura
                        if (item.Type == (int)ETypeReceipt.B || item.Type == (int)ETypeReceipt.EXENTO)
                        {
                            alicuotaIva.TipoDecComprobante = CustomizationConstant.FacturaB;

                            #region Importe neto gravado (SIN COMA)
                            var netogravado = Math.Round((totalBaseIva21B / 1.21m), 2);
                            alicuotaIva.ImporteNetoGravado = netogravado.ToString().Replace(",", "").Replace(".", "");
                            alicuotaIva.ImporteNetoGravado = alicuotaIva.ImporteNetoGravado.PadLeft(15, '0');
                            #endregion

                            #region Impuesto Liquidado
                            var impuestoLiquidado = Math.Round((netogravado * 0.21m), 2);
                            alicuotaIva.ImpuestoLiquidado = impuestoLiquidado.ToString("F2").Replace(",", "").Replace(".", "");
                            alicuotaIva.ImpuestoLiquidado = alicuotaIva.ImpuestoLiquidado.PadLeft(15, '0');
                            #endregion
                        }

                        if (item.Type == (int)ETypeReceipt.A)
                        {
                            alicuotaIva.TipoDecComprobante = CustomizationConstant.FacturaA;

                            #region Importe neto gravado (SIN COMA)
                            var subtotal = totalBaseIva21 - Math.Round(totalIva21, 2);
                            alicuotaIva.ImporteNetoGravado = subtotal.ToString().Replace(",", "").Replace(".", "");
                            alicuotaIva.ImporteNetoGravado = alicuotaIva.ImporteNetoGravado.PadLeft(15, '0');
                            #endregion

                            #region Impuesto Liquidado
                            alicuotaIva.ImpuestoLiquidado = totalIva21.ToString("F2").Replace(",", "").Replace(".", "");
                            alicuotaIva.ImpuestoLiquidado = alicuotaIva.ImpuestoLiquidado.PadLeft(15, '0');
                            #endregion
                        }
                        #endregion

                        #region Numero de Comprobante
                        alicuotaIva.NumeroDeComprobante = item.InvoiceNumber.ToString().PadLeft(20, '0');
                        #endregion
                        
                        #region Condicionales Iva                        
                        alicuotaIva.AlicuotaIva = "5";                        
                        #endregion

                        alicuotaIvaDtos.Add(alicuotaIva);
                    }
                    
                    if (totalIva27 > 0m || totalBaseIva27B > 0m) 
                    {
                        AlicuotaIvaDto alicuotaIva = new AlicuotaIvaDto();

                        #region Condicionales Tipo Factura
                        if (item.Type == (int)ETypeReceipt.B || item.Type == (int)ETypeReceipt.EXENTO)
                        {
                            alicuotaIva.TipoDecComprobante = CustomizationConstant.FacturaB;

                            #region Importe neto gravado (SIN COMA)
                            var netogravado = Math.Round((totalBaseIva27B / 1.27m), 2);
                            alicuotaIva.ImporteNetoGravado = netogravado.ToString().Replace(",", "").Replace(".", "");
                            alicuotaIva.ImporteNetoGravado = alicuotaIva.ImporteNetoGravado.PadLeft(15, '0');
                            #endregion

                            #region Impuesto Liquidado
                            var impuestoLiquidado = Math.Round((netogravado * 0.27m), 2);
                            alicuotaIva.ImpuestoLiquidado = impuestoLiquidado.ToString("F2").Replace(",", "").Replace(".", "");
                            alicuotaIva.ImpuestoLiquidado = alicuotaIva.ImpuestoLiquidado.PadLeft(15, '0');
                            #endregion

                        }

                        if (item.Type == (int)ETypeReceipt.A)
                        {
                            alicuotaIva.TipoDecComprobante = CustomizationConstant.FacturaA;

                            #region Importe neto gravado (SIN COMA)
                            var subtotal = totalBaseIva27 - Math.Round(totalIva27, 2);
                            alicuotaIva.ImporteNetoGravado = subtotal.ToString().Replace(",", "").Replace(".", "");
                            alicuotaIva.ImporteNetoGravado = alicuotaIva.ImporteNetoGravado.PadLeft(15, '0');
                            #endregion

                            #region Impuesto Liquidado
                            alicuotaIva.ImpuestoLiquidado = totalIva27.ToString("F2").Replace(",", "").Replace(".", "");
                            alicuotaIva.ImpuestoLiquidado = alicuotaIva.ImpuestoLiquidado.PadLeft(15, '0');
                            #endregion
                        }
                        #endregion

                        #region Numero de Comprobante
                        alicuotaIva.NumeroDeComprobante = item.InvoiceNumber.ToString().PadLeft(20, '0');
                        #endregion

                        
                        #region Condicionales Iva                        
                        alicuotaIva.AlicuotaIva = "6";                        
                        #endregion

                        alicuotaIvaDtos.Add(alicuotaIva);
                    }
                }

                foreach (AlicuotaIvaDto alicuotaIvaDto in alicuotaIvaDtos)
                {
                    await tw.WriteAsync
                        (
                            alicuotaIvaDto.TipoDecComprobante +
                            alicuotaIvaDto.PuntoDeVenta.ToString().PadLeft(5, '0') +
                            alicuotaIvaDto.NumeroDeComprobante +
                            alicuotaIvaDto.ImporteNetoGravado +
                            alicuotaIvaDto.AlicuotaIva.PadLeft(4, '0') +
                            alicuotaIvaDto.ImpuestoLiquidado +
                            "\n"
                        );
                }

                tw.Flush();

                byte[] bytes = ms.ToArray();

                ms.Close();

                return new OperationResponse<byte[]>(bytes);

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw;
            }
            finally
            {
                OutPutFile.Close();
                OutPutFile.Dispose();
            }
        }

        #endregion  


        #region IvaDigital
        public async Task<OperationResponse<byte[]>> ArchivoTxt(DateTime from, DateTime to, CancellationToken ct = default)
        {
            var query = await _contextSql
                            .Invoices
                            .Include(s => s.InvoiceDetails)
                            .AsNoTracking()
                            .Where(x => x.DateTime.Date >= from && x.DateTime.Date <= to).ToArrayAsync();

            StringWriter OutPutFile = new StringWriter();

            {
                try
                {
                    MemoryStream ms = new MemoryStream();
                    TextWriter tw = new StreamWriter(ms);

                    List<ArchivoTxtDto> archivoTxtDtos = new List<ArchivoTxtDto>();

                    foreach (Invoice invoice in query)
                    {
                        ArchivoTxtDto archivoTxtDto = new ArchivoTxtDto();

                        archivoTxtDto.FechaDeComprobante = invoice.DateTime.ToString("yyyyMMdd");

                        if (invoice.Type == (int)ETypeReceipt.B || invoice.Type == (int)ETypeReceipt.EXENTO)
                        {
                            archivoTxtDto.TipoDeComprobante = CustomizationConstant.FacturaB;
                        }

                        if (invoice.Type == (int)ETypeReceipt.A)
                        {
                            archivoTxtDto.TipoDeComprobante = CustomizationConstant.FacturaA;
                        }

                        archivoTxtDto.NumeroDeComprobante = invoice.InvoiceNumber.ToString().PadLeft(20, '0');
                        archivoTxtDto.NumeroDeComprobanteHasta = invoice.InvoiceNumber.ToString().PadLeft(20, '0');

                        if (invoice.CustomerCuit.Length == 8)
                        {
                            archivoTxtDto.CodigoDocumento = CustomizationConstant.DniId;
                        }

                        if (invoice.CustomerCuit.Length == 11)
                        {
                            if (invoice.CustomerCuit == CustomizationConstant.DefaultCUIT)
                            {
                                archivoTxtDto.CodigoDocumento = CustomizationConstant.NoCuitId;
                            }
                            else
                            {
                                archivoTxtDto.CodigoDocumento = CustomizationConstant.CuitId;
                            }
                        }

                        var cantidadAlicuota = invoice.InvoiceDetails.Select(y => y.Iva).Distinct().Count();
                        archivoTxtDto.AlicuotaIva = cantidadAlicuota.ToString();

                        archivoTxtDto.NumeroDeIdentificacionComprador = invoice.CustomerCuit == CustomizationConstant.DefaultCUIT ? CustomizationConstant.DefaultNoCUIT : invoice.CustomerCuit.Trim().ToString().PadLeft(20, '0');
                        archivoTxtDto.NombreCompletoComprador = invoice.CustomerName.ToUpper().Trim().ToString().PadRight(30, ' ');

                        archivoTxtDto.ImporteTotal = invoice.Total.ToString().Replace(",", "").Replace(".", "");
                        archivoTxtDto.ImporteTotal = archivoTxtDto.ImporteTotal.PadLeft(15, '0');

                        archivoTxtDto.FechaDePago = invoice.DateTime.ToString("yyyyMMdd");
                        archivoTxtDtos.Add(archivoTxtDto);
                    }

                    foreach (ArchivoTxtDto item in archivoTxtDtos)
                    {
                        await tw.WriteAsync
                            (
                                item.FechaDeComprobante +
                                item.TipoDeComprobante +
                                item.PuntoDeVenta +
                                item.NumeroDeComprobante +
                                item.NumeroDeComprobanteHasta +
                                item.CodigoDocumento +
                                item.NumeroDeIdentificacionComprador +
                                item.NombreCompletoComprador +
                                item.ImporteTotal +
                                item.NetoGravado +
                                item.NoCategorizados +
                                item.OperacionesExentas + //consultar exento
                                item.ImpuestosNacionales +
                                item.IngresosBrutos +
                                item.ImpuestosMunicipales +
                                item.ImpuestosInternos +
                                item.CodigoDeMoneda +
                                item.TipoDeCambio +
                                item.AlicuotaIva +
                                item.CodigoDeOperacion +
                                item.OtrosTributos +
                                item.FechaDePago +
                                '\n'

                           );
                    }

                    tw.Flush();

                    byte[] bytes = ms.ToArray();

                    ms.Close();

                    return new OperationResponse<byte[]>(bytes);
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw;
                }
                finally
                {
                    OutPutFile.Close();
                    OutPutFile.Dispose();
                }
            }
        }
        #endregion 


        #region Imprimir Factura En impresora Fiscal
        public async Task<string> PrintInvoice(Invoice model, CancellationToken ct = default)
        {
            string? closeFactura = null;
            //MANEJO DE ERRORES
            var cargarCliente = await _printer.CargarDatosCliente(model.CustomerName, model.CustomerCuit, model.CustomerAddress, (ETypeReceipt)model.Type).ConfigureAwait(false);

            if (cargarCliente == null)
            {
                await _printer.CerrarJornadaFiscal();
                return "ErrorCliente";
            }
            //Contiene loop de reintentos en consultar Estado
            var openDoc = await _printer.OpenInvoice((ETypeReceipt)model.Type, model.CustomerName, eTypeDocumentClient.Cuil, model.CustomerAddress).ConfigureAwait(false);

            if (openDoc == null)
            {
                await _printer.CloseFactura(1, "").ConfigureAwait(false);
                return "ErrorAbrir";                
            }

            //TODO por cada item mandar a imprimir
            foreach (var item in model.InvoiceDetails)
            {
                //Contiene loop de reintentos en consultar Estado
                var imprimir = await _printer.PrintItem(item.ProductName, item.Quantity, item.Price, item.Iva, item.ProductCode.ToString()).ConfigureAwait(false);

                if (imprimir == null)
                {
                    //Intento recuperar numero de comprobante mediante Status
                    closeFactura = await _printer.CloseFactura(1, "", true).ConfigureAwait(false);

                    if (closeFactura == null)
                    {
                        return "ErrorImprimir";
                    }
                }
            }
            if (string.IsNullOrEmpty(closeFactura))
            {
                closeFactura = await _printer.CloseFactura(1, "").ConfigureAwait(false);
            }

            if (closeFactura == null)
            {
                Thread.Sleep(1000);
                await _printer.CerrarJornadaFiscal();
                return "ErrorCerrar";
            }

            return closeFactura;

        }

        #endregion


    }
}
