using AutoMapper;
using Kiltex.SistemaGestion.Domain;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.SDK.Error;
using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Models.Dtos;
using Microsoft.EntityFrameworkCore;


namespace Kiltex.SistemaGestion.Services.Services
{
    public class InvoiceService : BaseService
    {
        public InvoiceService(ErrorManager logger, DBContext context, IMapper maper) :
            base(logger, context, maper)
        { }
        public async Task<OperationResponse<DtoInvoice>> GetById(long id)
        {
            var factura = await _contextSql
                               .Invoices
                               .Include(x => x.InvoiceDetails)
                               .AsNoTracking()
                               .FirstOrDefaultAsync(p => p.Id == id)
                               .ConfigureAwait(false);
            if (factura == null)

                return new OperationResponse<DtoInvoice>(null, false, new OperationExceptions("000", $"Factura no encontrada {id}"));

            var result = _mapper.Map<DtoInvoice>(factura);
           

            return new OperationResponse<DtoInvoice>(result);
        }

        public async Task<OperationResponse<IdResponse<long>>> NewInvoice(DtoInvoice model, CancellationToken ct = default)
        {
            model.Id = 0;
            if (String.IsNullOrEmpty(model.CustomerName) )
            {
                return Error<IdResponse<long>>("000", "Datos incompletos");
            }
            return await AddOrUpdate(model, ct).ConfigureAwait(false);
        }

        public async Task<OperationResponse<DtoPagination<DtoInvoice>>> ListInvoices(RequestPaginatedData<string> request)
        {
            var query = _contextSql
                                .Invoices
                                .AsNoTracking()
                                .Include(p => p.InvoiceDetails)
                                .Where(p => p.CustomerCuit.ToLower().Contains(request.Filter ?? ""));
                                //   (!p.Dni.HasValue || p.Dni.ToString().Contains(request.Filter ?? "")) ||
                                //   p.Cuit.ToLower().Contains(request.Filter ?? ""));

            var count = await query.CountAsync().ConfigureAwait(false);

            var list = await query.OrderByDescending(p => p.DateTime)
                                  .Skip(request.Page * request.PageSize)
                                  .Take(request.PageSize)
                                  .ToListAsync()
                                  .ConfigureAwait(false);

            var result = _mapper.Map<List<DtoInvoice>>(list);


            return new OperationResponse<DtoPagination<DtoInvoice>>(new DtoPagination<DtoInvoice>
            {
                Data = result,
                PageSize = request.PageSize,
                TotalCount = count
            });
        }
        public async Task<OperationResponse<IdResponse<long>>> AddOrUpdate(DtoInvoice model, CancellationToken ct = default)
        {

            var invoiceModel = _mapper.Map<Invoice>(model);
           
           
            if (invoiceModel.Id == 0)
            {
                if (invoiceModel.CustomerId == 0)
                {
                  var user=await  _contextSql.Customers.AsNoTracking().FirstOrDefaultAsync(p => p.Name == "Admin");
                    invoiceModel.CustomerId = user.Id;
                }              

                await _contextSql.Invoices.AddAsync(invoiceModel, ct).ConfigureAwait(false);
                await _contextSql.SaveChangesAsync(ct).ConfigureAwait(false);

            }
         

            return Ok(new IdResponse<long>(invoiceModel.Id));
        }

    }
}
