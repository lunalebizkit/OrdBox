using AutoMapper;
using Dapper;
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
                    result.Iva10 += ((decimal)item.Iva == (decimal)10.5) ? (item.Quantity * item.Price) - (item.Quantity * item.Price) / 1.10m : 0;
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
                if (String.IsNullOrEmpty(model.CustomerName))
                {
                    _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                    return Error<IdResponse<long>>(new OperationExceptions("000", "Datos incompletos"));
                }
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
                                     ((!request.Filter.Date.Contains("") || request.Filter.Date != null) ? p.DateTime.Date.ToString().Contains(request.Filter.Date) : true));

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
            var productDetail = new Product();
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

                    foreach (var detail in invoiceModel.InvoiceDetails)
                    {
                        var oldProduct = await _contextSql.Products.AsNoTracking().FirstAsync(p => p.Id == detail.ProductId).ConfigureAwait(false);

                        productDetail = oldProduct;
                        productDetail.UpdateStock(-detail.Quantity);
                        _contextSql.Products.Update(productDetail);
                    }
                    if (_config.Status)
                    {
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
            IEnumerable<DtoResponseInvoiceReportTotals> invoiceReports = new List<DtoResponseInvoiceReportTotals>();

            var parameters = new { dateFrom = request.Filter.DateFrom, dateTo = request.Filter.DateTo, categoryId = request.Filter.CategoryId == 0 ? null : request.Filter.CategoryId };
            try
            {
                using (var connection = new SqlConnection(ConnectionString))
                {
                    var ventas = connection.Query<DtoResponseInviocesReport>(StoredProcedure.INVOICEREPORTS, parameters, commandType: CommandType.StoredProcedure);

                    var totalVentas = connection.Query<DtoResponseInvoiceReportTotals>(StoredProcedure.INVOICEREPORTSTOTAL, parameters, commandType: CommandType.StoredProcedure);

                    foreach (var item in totalVentas)
                    {
                        item.InvoicesReports = new List<DtoResponseInviocesReport>();

                        item.InvoicesReports = ventas.Where(yo => (DateTimeOffset)yo.Date.Date == (DateTimeOffset)item.InvoiceDate).ToList();

                    }
                    invoiceReports = totalVentas;

                }
                return new OperationResponse<IEnumerable<DtoResponseInvoiceReportTotals>>(invoiceReports);
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                return Error<IEnumerable<DtoResponseInvoiceReportTotals>>(new OperationExceptions(ErrorsCodes.C_999_ERROR_GENERICO, ex.Message.ToString()));

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

            var newDtoDetalleResumen = new List<AlicuotaIvaDto>();


            var tipo = 0;
            var iva = 0;
            var resumen = new AlicuotaIva();

            StringWriter OutPutFile = new StringWriter();

            try
            {

                MemoryStream ms = new MemoryStream();
                TextWriter tw = new StreamWriter(ms);

                foreach (var item in query)
                {
                    var subtotal = item.Total - item.IvaTotal;
                    string sinComa = subtotal.ToString().Replace(",", "");
                    string ivaSinComa = item.IvaTotal.ToString("F2").Replace(",", "");
                    var newItem = _mapper.Map<AlicuotaIvaDto>(item);

                    #region Condicionales Tipo
                    if (item.Type == 2)
                    {
                        tipo = 6;
                    }
                    if (item.Type == 1)
                    {
                        tipo = 1;
                    }

                    #endregion

                    foreach (var item2 in item.InvoiceDetails)
                    {
                        #region Condicionales Iva
                        if (item2.Iva == 10.50m)
                        {
                            iva = 4;
                        }
                        if (item2.Iva == 21.00m)
                        {
                            iva = 5;
                        }
                        if (item2.Iva == 27.00m)
                        {
                            iva = 6;
                        }
                        #endregion

                        await tw.WriteAsync
                            (
                                tipo.ToString().PadLeft(3, '0') +
                                newItem.PuntoDeVenta.ToString().PadLeft(5, '0') +
                                item.InvoiceNumber.ToString().PadLeft(20, '0') +
                                sinComa.ToString().PadLeft(15, '0') +
                                iva.ToString().PadLeft(4, '0') +
                                ivaSinComa.PadLeft(15, '0') +
                                "\n"
                            );
                    }
                    newDtoDetalleResumen.Add(newItem);
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

            var newDtoDetalleResumem = new List<ArchivoTxtDto>();

            var resumen = new ArchivosTxt();

            StringWriter OutPutFile = new StringWriter();

            {
                try
                {
                    var tipoComprobante = 0;
                    var tipoDocumento = "";
                    MemoryStream ms = new MemoryStream();
                    TextWriter tw = new StreamWriter(ms);

                    foreach (var item in query)
                    {
                        if (item.Type == 2)
                        {
                            tipoComprobante = 6;
                        }

                        if (item.Type == 1)
                        {
                            tipoComprobante = 1;
                        }

                        if (item.CustomerCuit.Length == 8)
                        {
                            tipoDocumento = "96";
                        }

                        if (item.CustomerCuit.Length == 11)
                        {
                            tipoDocumento = "80";
                        }
                        string sinComa = item.Total.ToString().Replace(",", "");
                        var newItem = _mapper.Map<ArchivoTxtDto>(item);

                        await tw.WriteAsync
                            (
                                item.DateTime.ToString("yyyyMMdd") +
                                tipoComprobante.ToString().PadLeft(3, '0') +
                                newItem.PuntoDeVenta.PadLeft(5, '0') +
                                item.InvoiceNumber.ToString().PadLeft(20, '0') +
                                item.InvoiceNumber.ToString().PadLeft(20, '0') +
                                tipoDocumento +
                                item.CustomerCuit.ToString().PadLeft(20, '0') +
                                item.CustomerName.PadRight(30, ' ') +
                                sinComa.PadLeft(15, '0') +
                                newItem.NetoGravado +
                                newItem.NoCategorizados +
                                newItem.OperacionesExentas +
                                newItem.ImpuestosNacionales +
                                newItem.IngresosBrutos +
                                newItem.ImpuestosMunicipales +
                                newItem.ImpuestosInternos +
                                newItem.CodigoDeMoneda +
                                newItem.TipoDeCambio +
                                newItem.AlicuotaIva +
                                newItem.CodigoDeOperacion +
                                newItem.OtrosTributos +
                                item.DateTime.ToString("yyyyMMdd") +
                                '\n'

                           );
                        newDtoDetalleResumem.Add(newItem);
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

            //MANEJO DE ERRORES
            var cargarCliente = await _printer.CargarDatosCliente(model.CustomerName, model.CustomerCuit, model.CustomerAddress, (ETypeReceipt)model.Type).ConfigureAwait(false);

            if (cargarCliente == null)
            {
                await _printer.CerrarJornadaFiscal();
                return "ErrorCliente";
            }

            var openDoc = await _printer.OpenInvoice((ETypeReceipt)model.Type, model.CustomerName, eTypeDocumentClient.Cuil, model.CustomerAddress).ConfigureAwait(false);

            if (openDoc == null)
            {
                await _printer.CloseFactura(1, model.CustomerName).ConfigureAwait(false);
                return "ErrorAbrir";
            }
            //TODO por cada item mandar a imprimir
            foreach (var item in model.InvoiceDetails)
            {
                var imprimir = await _printer.PrintItem(item.ProductName, item.Quantity, item.Price, item.Iva, item.ProductCode.ToString()).ConfigureAwait(false);

                if (imprimir == null)
                {
                    await _printer.CloseFactura(1, model.CustomerName).ConfigureAwait(false);
                    return "ErrorImprimir";
                }
            }

            var closeFactura = await _printer.CloseFactura(1, model.CustomerName).ConfigureAwait(false);

            if (closeFactura == null)
            {
                await _printer.CerrarJornadaFiscal();
                return "ErrorCerrar";
            }

            return closeFactura;

        }

        #endregion


    }
}
