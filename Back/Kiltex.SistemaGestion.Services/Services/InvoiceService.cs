using AutoMapper;
using Kiltex.SistemaGestion.Domain;
using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.SDK.Error;
using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.ImpresoraFiscal;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Microsoft.EntityFrameworkCore;


namespace Kiltex.SistemaGestion.Services.Services
{
    public class InvoiceService : BaseService
    {
        private readonly IPrinter _printer;
        public InvoiceService(ErrorManager logger, DBContext context, IMapper maper, IPrinter printer) :
            base(logger, context, maper)
        { 
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
                if (String.IsNullOrEmpty(model.CustomerName) )
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
                                     && ((request.Filter.Number.HasValue && request.Filter.Number != 0) ? p.InvoiceNumber == request.Filter.Number : true));

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
                    
                    foreach (var detail in invoiceModel.InvoiceDetails)
                    {
                        var oldProduct = await _contextSql.Products.AsNoTracking().FirstAsync(p => p.Id == detail.ProductId).ConfigureAwait(false);

                        productDetail= oldProduct;
                        productDetail.UpdateStock(- detail.Quantity);
                        _contextSql.Products.Update(productDetail);
                    }
                    var error = await PrintInvoice(invoiceModel, ct);

                    if(error == "ErrorCliente")
                    {
                        _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                        return Error<IdResponse<long>>(new OperationExceptions("000", "Error al cargar cliente, compruebe el CUIT/DNI"));
                    }

                    if(error == "ErrorAbrir")
                    {
                        _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                        return Error<IdResponse<long>>(new OperationExceptions("000", "Error al abrir documento , intente nuevamente"));
                    }

                    if(error == "ErrorImprimir")
                    {
                        _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                        return Error<IdResponse<long>>(new OperationExceptions("000", "Error al imprimir item, intente con un cierre Z"));
                    }

                    if (error == "ErrorCerrar")
                    {
                        _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                        return Error<IdResponse<long>>(new OperationExceptions("000", "Error al cerrar documento, intente con un cierre Z"));
                    }

                    invoiceModel.InvoiceNumber = long.Parse(error);
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

        public async Task<string> PrintInvoice(Invoice model, CancellationToken ct = default)
        {

            //MANEJO DE ERRORES
            var cargarCliente = await _printer.CargarDatosCliente(model.CustomerName, model.CustomerCuit,model.CustomerAddress, (ETypeReceipt)model.Type).ConfigureAwait(false);

            if(cargarCliente == null)
            {
                await _printer.CerrarJornadaFiscal();
                return "ErrorCliente";
            }

            var openDoc = await _printer.OpenInvoice((ETypeReceipt)model.Type, model.CustomerName,eTypeDocumentClient.Cuil, model.CustomerAddress).ConfigureAwait(false);

            if(openDoc == null)
            {
                await _printer.CloseFactura(1, model.CustomerName).ConfigureAwait(false);
                return "ErrorAbrir";
            }
            //TODO por cada item mandar a imprimir
            foreach(var item in model.InvoiceDetails)
            {               
                var imprimir = await _printer.PrintItem(item.ProductName,item.Quantity,item.Price,item.Iva,item.ProductCode.ToString()).ConfigureAwait(false);
                
                if(imprimir == null)
                {
                    await _printer.CloseFactura(1, model.CustomerName).ConfigureAwait(false);
                    return "ErrorImprimir";
                }
            }

            var closeFactura = await _printer.CloseFactura(1, model.CustomerName).ConfigureAwait(false);
            
            if(closeFactura == null)
            {
                await _printer.CerrarJornadaFiscal();
                return "ErrorCerrar";
            }

            return closeFactura;

        }
    }
}
