using AutoMapper;
using Kiltex.SistemaGestion.Domain;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.SDK.Error;
using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Models.Dtos;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kiltex.SistemaGestion.Services.Services
{
    public class SupplierOrderService : BaseService
    {
        public SupplierOrderService(ErrorManager logger, DBContext context, IMapper maper) :
            base(logger, context, maper)
        { }
        public async Task<OperationResponse<DtoSupplierOrder>> GetById(long id)
        {
            SupplierOrder order = await _contextSql
                                .SupplierOrders
                                .Include(p => p.Supplier)
                                .Include(p => p.SupplierOrderDetail)
                                .AsNoTracking()
                                .FirstOrDefaultAsync(p => p.Id == id)
                                .ConfigureAwait(false);
            if (order == null)

                return new OperationResponse<DtoSupplierOrder>(null, false, new OperationExceptions("000", $"Orden no encontrada {id}"));


            DtoSupplierOrder result = _mapper.Map<DtoSupplierOrder>(order);

            return new OperationResponse<DtoSupplierOrder>(result);
        }
        public async Task<OperationResponse<IdResponse<long>>> AddOrUpdate(DtoAddSupplierOrder model, CancellationToken ct = default)
        {

            SupplierOrder newOrder = _mapper.Map<SupplierOrder>(model);
            if (newOrder.Id == 0)
            {
                newOrder.StatusId = 1;
                await _contextSql.SupplierOrders.AddAsync(newOrder, ct).ConfigureAwait(false);

            }
            else
            {
                //var oldOrder = await _contextSql
                //    .SupplierOrders
                //    .AsNoTracking()
                //    .Include(p => p.Supplier)
                //    .Include(p => p.SupplierOrderDetail)
                //    .FirstAsync(p => p.Id == newOrder.Id)
                //    .ConfigureAwait(false);

                _contextSql.SupplierOrders.Update(newOrder);


            }
            await _contextSql.SaveChangesAsync(ct).ConfigureAwait(false);

            return Ok(new IdResponse<long>(newOrder.Id));
        }
        //public async Task<OperationResponse<DtoPagination<DtoSupplierOrder>>> List(RequestPaginatedData<string> request, int? status)
        //{
        //    var query = _contextSql
        //                        .SupplierOrders
        //                        .AsNoTracking()
        //                        .Include(p => p.SupplierOrderDetail)
        //                        .Include(p => p.Supplier)
        //                        .Where(p => p.Supplier.Name.ToLower().Contains(request.Filter ?? "") && p.StatusId == status);

        //    var count = await query.CountAsync().ConfigureAwait(false);

        //    var list = await query.OrderBy(p => p.Id)
        //                          .Skip(request.Page * request.PageSize)
        //                          .Take(request.PageSize)
        //                          .ToListAsync()
        //                          .ConfigureAwait(false);

        //    var dto = _mapper.Map<List<DtoSupplierOrder>>(list);


        //    return new OperationResponse<DtoPagination<DtoSupplierOrder>>(new DtoPagination<DtoSupplierOrder>
        //    {
        //        Data = dto,
        //        PageSize = request.PageSize,
        //        TotalCount = count
        //    });
        //}
        public async Task<OperationResponse<DtoPagination<DtoSupplierOrder>>> List(RequestPaginatedData<ProductFilter> request)
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
                                   ((request.Filter.Status.HasValue &&
                                   request.Filter.Status.Value > 0) ? 
                                   p.StatusId == request.Filter.Status : true)
                                &&

                                 (request.Filter.Supplier.Count > 0 ? request.Filter.Supplier.Contains(p.SupplierId) : true)
                                 );

            var count = await query.CountAsync().ConfigureAwait(false);

            var list = await query.OrderBy(p => p.Id)
                                  .Skip(request.Page * request.PageSize)
                                  .Take(request.PageSize)
                                  .ToListAsync()
                                  .ConfigureAwait(false);

            var dto = _mapper.Map<List<DtoSupplierOrder>>(list);


            return new OperationResponse<DtoPagination<DtoSupplierOrder>>(new DtoPagination<DtoSupplierOrder>
            {
                Data = dto,
                PageSize = request.PageSize,
                TotalCount = count
            });
        }

    }

}
