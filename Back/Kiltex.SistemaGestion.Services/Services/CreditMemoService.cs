using AutoMapper;
using Kiltex.SistemaGestion.Domain;
using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.SDK.Error;
using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.ImpresoraFiscal;
using Kiltex.SistemaGestion.Services.ImpresoraFiscal.Printer250F;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace Kiltex.SistemaGestion.Services.Services
{
    public class CreditMemoService : BaseService
    {
        private readonly PrinterStatus _config;
        private readonly IPrinter _printer;
        public CreditMemoService(ErrorManager logger, DBContext context, IMapper mapper, IPrinter printer, PrinterStatus config) :
          base(logger, context, mapper)
        {
            _config = config;
            _printer = printer;
        }

        //Metodo Get By Id
        public async Task<OperationResponse<DtoRequestCreditMemo>> GetById(long id)
        {
            try
            {
                var creditMemo = await _contextSql
                                    .CreditMemo
                                    .Include(x => x.CreditMemoDetail)
                                    .AsNoTracking()
                                    .FirstOrDefaultAsync(c => c.Id == id)
                                    .ConfigureAwait(false);

                if (creditMemo == null)
                {
                    _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                    return Error<DtoRequestCreditMemo>(new OperationExceptions("000", $"Nota de Credito no encontrado ID: {id}"));
                }

                var result = _mapper.Map<DtoRequestCreditMemo>(creditMemo);

                return new OperationResponse<DtoRequestCreditMemo>(result);

            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }
        }

        public async Task<OperationResponse<IdResponse<long>>> NewMemo(DtoRequestCreditMemo model, CancellationToken ct = default)
        {
                model.Id = 0;
                return await AddOrUpdate(model, ct).ConfigureAwait(false);
        }

        public async Task<OperationResponse<DtoPagination<DtoRequestCreditMemo>>> List(RequestPaginatedData<SpecificFilter> request)
        {
            try
            {
                var query = _contextSql
                                    .CreditMemo
                                    //.OrderByDescending(p => p.DateTime)
                                    .AsNoTracking()
                                    .Include(p => p.CreditMemoDetail)
                                    .Where(p => (!string.IsNullOrEmpty(request.Filter.Cuit) ? p.CustomerCuit.ToLower().Contains(request.Filter.Cuit) : true)
                                     && ((request.Filter.Number.HasValue && request.Filter.Number != 0) ? p.Id == request.Filter.Number : true) &&
                                     ((!request.Filter.Date.Contains("") || request.Filter.Date != null) ? p.DateTime.Date.ToString().Contains(request.Filter.Date) : true));

                var count = await query.CountAsync().ConfigureAwait(false);

                var list = await query.OrderByDescending(p => p.Id).ThenByDescending(p => p.DateTime.Date)
                                      .Skip(request.Page * request.PageSize)
                                      .Take(request.PageSize)
                                      .ToListAsync()
                                      .ConfigureAwait(false);

                var result = _mapper.Map<List<DtoRequestCreditMemo>>(list);


                return new OperationResponse<DtoPagination<DtoRequestCreditMemo>>(new DtoPagination<DtoRequestCreditMemo>
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

        public async Task<OperationResponse<IdResponse<long>>> AddOrUpdate(DtoRequestCreditMemo model, CancellationToken ct = default)
        {
            var transaction = _contextSql.Database.BeginTransaction();
            CreditMemo creditModel = null;

            try
             {
                if (model.Id == 0)
                {
        
                    creditModel = _mapper.Map<CreditMemo>(model);
                    creditModel.InvoiceId = creditModel.InvoiceId == 0 ? null : creditModel.InvoiceId;

                    var regex = new Regex(@"^-?[0-9][0-9,\.]+$");

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

                    //Verfico que la factura C no pueda realizarse al colocar un DNI
                    if (model.Type == 3 && model.CustomerCuit.Length != 11)
                    {
                        _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                        return Error<IdResponse<long>>(new OperationExceptions("000", "Error al cargar cliente, no puede cargar un DNI con Factura tipo C"));
                    }

                    //Verifico que el DNI tenga mayor a 7 caracteres y menor a 9
                    if (model.Type == 2 && model.CustomerCuit.Length < 7 || model.CustomerCuit.Length > 8 && model.CustomerCuit.Length != 11)
                    {
                        _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                        return Error<IdResponse<long>>(new OperationExceptions("000", "Error al cargar cliente, verifique DNI"));
                    }

                    if (_config.Status)
                    {
                        var error = await PrintCreditMemo(model, ct);

                        if (error == "ErrorCliente")
                        {
                            _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                            return Error<IdResponse<long>>(new OperationExceptions("000", "Error al cargar cliente, compruebe el CUIT/DNI"));
                        }

                        if (error == "ErrorAbrir")
                        {
                            _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                            return Error<IdResponse<long>>(new OperationExceptions("000", "Error al abrir documento , intente con un cierre Z"));
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

                        creditModel.CreditMemoNumber = long.Parse(error);
                    }
                    await _contextSql.CreditMemo.AddAsync(creditModel, ct).ConfigureAwait(false);
                }
                

                await _contextSql.SaveChangesAsync(ct).ConfigureAwait(false);
                transaction.Commit();
                return Ok(new IdResponse<long>(creditModel.Id));
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                return Error<IdResponse<long>>(new OperationExceptions(ErrorsCodes.C_999_ERROR_GENERICO, ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO)));
            }
        }

        public async Task<OperationResponse<IdResponse<long>>> Update(DtoRequestCreditMemo model, CancellationToken ct = default)
        {
            try
            {
                if (model.Id == 0)
                {
                    _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                    return Error<IdResponse<long>>(new OperationExceptions("000", "La nota de credito no tiene ID"));
                }
                return await AddOrUpdate(model, ct).ConfigureAwait(false);

            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }
        }

        public async Task<string> PrintCreditMemo(DtoRequestCreditMemo model, CancellationToken ct = default)
        {

            //MANEJO DE ERRORES
            var cargarCliente = await _printer.CargarDatosCliente(model.CustomerName, model.CustomerCuit, model.CustomerAddress, (ETypeReceipt)model.Type).ConfigureAwait(false);

            if (cargarCliente == null)
            {
                await _printer.CerrarJornadaFiscal();
                return "ErrorCliente";
            }

            var openDoc = await _printer.OpenNC((ETypeReceipt)model.Type, model.CustomerName, eTypeDocumentClient.Cuil, model.CustomerAddress).ConfigureAwait(false);

            if (openDoc == null)
            {
                await _printer.CloseFactura(1, model.CustomerName).ConfigureAwait(false);
                return "ErrorAbrir";
            }
            //TODO por cada item mandar a imprimir
            foreach (var item in model.CreditMemoDetail)
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
    }
}
