using AutoMapper;
using Kiltex.SistemaGestion.Domain;
using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.SDK.Error;
using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;
using Microsoft.EntityFrameworkCore;

namespace Kiltex.SistemaGestion.Services.Services
{
    public class SupplierOrderService : BaseService
    {
        public SupplierOrderService(ErrorManager logger, DBContext context, IMapper maper) :
            base(logger, context, maper)
        { }
        public async Task<OperationResponse<DtoResponseSupplierOrderById>> GetById(long id)
        {
            var order = await _contextSql
                                .SupplierOrders
                                .Include(p => p.Supplier)
                                 .ThenInclude(p =>p.EmailEntities)
                                .Include(p => p.SupplierOrderDetail)
                                .ThenInclude(p => p.Product)
                                .AsNoTracking()
                                .FirstOrDefaultAsync(p => p.Id == id)
                                .ConfigureAwait(false);
            if (order == null)

                return new OperationResponse<DtoResponseSupplierOrderById>(null, false, new OperationExceptions("000", $"Orden no encontrada {id}"));


            var result = _mapper.Map<DtoResponseSupplierOrderById>(order);

            return new OperationResponse<DtoResponseSupplierOrderById>(result);
        }
        public async Task<OperationResponse<IdResponse<long>>> AddOrUpdate(DtoRequestSupplierOrder model, CancellationToken ct = default)
        {
            var transaction = _contextSql.Database.BeginTransaction();
            var newOrder = _mapper.Map<SupplierOrder>(model);
            var productDetail = new Product();
            try
            {
                if (newOrder.Id == 0)
                {
                    newOrder.StatusId = (int)ESupplierOrderStatuses.Pendiente;
                    await _contextSql.SupplierOrders.AddAsync(newOrder, ct).ConfigureAwait(false);

                }
                else
                {
                    var oldOrder = await _contextSql
                        .SupplierOrders
                        .AsNoTracking()
                        .Include(p => p.Supplier)
                        .Include(p => p.SupplierOrderDetail)
                        .FirstAsync(p => p.Id == newOrder.Id, ct)
                        .ConfigureAwait(false);

                    _contextSql.SupplierOrders.Update(newOrder);

                    if (newOrder.StatusId == (int)ESupplierOrderStatuses.Aceptado)
                    {
                        foreach (var detail in newOrder.SupplierOrderDetail)
                        {
                            var oldProduct = await _contextSql.
                                                    Products
                                                    .AsNoTracking()
                                                    .FirstOrDefaultAsync(p => p.Id == detail.ProductId, ct)
                                                    .ConfigureAwait(false);

                            productDetail = _mapper.Map<Product>(oldProduct);
                            productDetail.UpdateStock( detail.OrderedQuantity);
                            _contextSql.Products.Update(productDetail);
                        }
                        
                    }

                    
                }
                
                await _contextSql.SaveChangesAsync(ct).ConfigureAwait(false);
                transaction.Commit();
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_010_ERROR_EXCEPTION), ex);
                throw;
            }
           

            return Ok(new IdResponse<long>(newOrder.Id));
        }
  
        public async Task<OperationResponse<DtoPagination<DtoResponseSupplierOrder>>> List(RequestPaginatedData<ProductFilter> request)
        {
            var query = _contextSql
                                .SupplierOrders
                                .AsNoTracking()
                                .Include(p => p.SupplierOrderDetail)
                                .ThenInclude(p => p.Product)
                                .Include(p => p.Supplier)                                
                                .Where(p =>
                                    ((request.Filter.Category.HasValue && request.Filter.Category.Value > 0) ?
                                        p.SupplierOrderDetail.Any( x => x.Product.CategoryId == request.Filter.Category ): true)
                                        &&
                                   ((request.Filter.Status.HasValue && request.Filter.Status.Value > 0) ? 
                                   p.StatusId == request.Filter.Status : true)
                                &&

                                 ((request.Filter.Supplier.Count > 0 && !request.Filter.Supplier.Contains(0)) ? request.Filter.Supplier.Contains(p.SupplierId) : true)
                                 );

            var count = await query.CountAsync().ConfigureAwait(false);

            var list = await query.OrderBy(p => p.Id)
                                  .Skip(request.Page * request.PageSize)
                                  .Take(request.PageSize)
                                  .ToListAsync()
                                  .ConfigureAwait(false);

            var dto = _mapper.Map<List<DtoResponseSupplierOrder>>(list);


            return new OperationResponse<DtoPagination<DtoResponseSupplierOrder>>(new DtoPagination<DtoResponseSupplierOrder>
            {
                Data = dto,
                PageSize = request.PageSize,
                TotalCount = count
            });
        }

    }

}
