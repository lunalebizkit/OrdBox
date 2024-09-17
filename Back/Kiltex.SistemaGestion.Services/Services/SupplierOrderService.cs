using AutoMapper;
using Kiltex.SistemaGestion.Domain;
using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.SDK.Error;
using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Kiltex.SistemaGestion.Services.Services
{
    public class SupplierOrderService : BaseService
    {
        private readonly EmailService _emailService;
        public SupplierOrderService(ErrorManager logger, DBContext context, IMapper maper, IConfiguration configuration, EmailService emailService) :
            base(logger, context, maper, configuration)
        {
            this._emailService = emailService;
        }
        public async Task<OperationResponse<DtoResponseSupplierOrderById>> GetById(long id)
        {
            try
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
                {
                    _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                    return Error<DtoResponseSupplierOrderById>(new OperationExceptions("000", $"Orden no encontrada ID :{id}"));
                }

                var result = _mapper.Map<DtoResponseSupplierOrderById>(order);

                return new OperationResponse<DtoResponseSupplierOrderById>(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }
        }
        public async Task<OperationResponse<IdResponse<long>>> AddOrUpdateEmail(DtoRequestSupplierOrder model, CancellationToken ct = default)
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
                            productDetail.UpdateStock( detail.RecievedQuantity);
                            _contextSql.Products.Update(productDetail);
                        }
                        
                    }

                    
                }
                
                await _contextSql.SaveChangesAsync(ct).ConfigureAwait(false);

                transaction.Commit();

                if (model.SupplierEmail.Count>0){
                    await SendOrderEmail(new DtoSendOrderEmail { 
                        Id = newOrder.Id,
                        Emails = model.SupplierEmail
                    });
                }
                return Ok(new IdResponse<long>(newOrder.Id));
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_010_ERROR_EXCEPTION), ex);
                throw;
            }
           
            
        }
        public async Task<OperationResponse<IdResponse<long>>> AddOrUpdate(DtoRequestSupplierOrder model, CancellationToken ct = default)
        {
           // var transaction = _contextSql.Database.BeginTransaction();
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
                      
                        .Include(p => p.Supplier)
                        .Include(p => p.SupplierOrderDetail)
                        .FirstAsync(p => p.Id == newOrder.Id)
                        .ConfigureAwait(false);

                    
                    _contextSql.SupplierOrderDetails.RemoveRange(oldOrder.SupplierOrderDetail);

                    _contextSql.Entry(oldOrder).State = EntityState.Detached;

                    await _contextSql.SaveChangesAsync(ct).ConfigureAwait(false);

                    var newOrder2 = _mapper.Map<SupplierOrder>(newOrder);

                    foreach (var item in newOrder.SupplierOrderDetail)
                    {
                        item.Id = 0;

                        oldOrder.SupplierOrderDetail.Add(item);
                    }




                    if (newOrder.StatusId == (int)ESupplierOrderStatuses.Aceptado && oldOrder.StatusId != (int)ESupplierOrderStatuses.Aceptado)
                    {
                        foreach (var detail in newOrder.SupplierOrderDetail)
                        {
                            var oldProduct = await _contextSql.
                                                    Products
                                                    
                                                    .FirstOrDefaultAsync(p => p.Id == detail.ProductId, ct)
                                                    .ConfigureAwait(false);

                            productDetail = _mapper.Map<Product>(oldProduct);
                            productDetail.UpdateStock(detail.RecievedQuantity);
                            _contextSql.Products.Update(productDetail);
                        }

                    }
                    _contextSql.Attach(newOrder2);
                    _contextSql.Update(newOrder2);
                  
                }

                await _contextSql.SaveChangesAsync(ct).ConfigureAwait(false);
                
               // transaction.Commit();
                return Ok(new IdResponse<long>(newOrder.Id));
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_010_ERROR_EXCEPTION), ex);
                throw;
            }


        }

        public async Task<OperationResponse<bool>> SendOrderEmail(DtoSendOrderEmail model)
        {
            try
            {
                var order = await _contextSql
                                    .SupplierOrders
                                    .Include(p => p.Supplier)
                                    .Include(p => p.SupplierOrderDetail)
                                    .ThenInclude(p => p.Product)
                                    .AsNoTracking()
                                    .FirstOrDefaultAsync(p => p.Id == model.Id)
                                    .ConfigureAwait(false);
                if (order == null)
                {
                    _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                    return Error<bool>(new OperationExceptions("000", $"Orden no encontrada ID :{model.Id}"));
                }
                if (order.StatusId == (int)ESupplierOrderStatuses.Pendiente)
                {
                    var result = _mapper.Map<DtoResponseSupplierOrderById>(order);
                    List<DtoResponseOrderByIdDetail> orderDetail = new List<DtoResponseOrderByIdDetail>(result.OrderDetail);
                   
                    var email = await _emailService.SendOrder(model.Emails, order.Supplier.Name, order.Id.ToString(), order.DateTime.ToString("dd/MM/yyyy"), order.IsPaid, orderDetail);

                    if (email.Success)
                    {
                        return new OperationResponse<bool>(true);

                    }
                    else
                    {
                        return new OperationResponse<bool>(false);
                    }

                }
                return new OperationResponse<bool>(false);
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }
        }

        public async Task<OperationResponse<DtoPagination<DtoResponseSupplierOrder>>> List(RequestPaginatedData<ProductFilter> request)
        {
            try
            {
                var query = _contextSql
                                .SupplierOrders
                                .AsNoTracking()
                                .Include(p => p.SupplierOrderDetail)
                                .ThenInclude(p => p.Product)
                                .Include(p => p.Supplier)
                                .Where(p =>
                                    ((request.Filter.Category.HasValue && request.Filter.Category.Value > 0) ?
                                        p.SupplierOrderDetail.Any(x => x.Product.CategoryId == request.Filter.Category) : true)
                                        &&
                                   ((request.Filter.Status.HasValue && request.Filter.Status.Value > 0) ?
                                   p.StatusId == request.Filter.Status : true)
                                &&

                                 ((request.Filter.Supplier.Count > 0 && !request.Filter.Supplier.Contains(0)) ? request.Filter.Supplier.Contains(p.SupplierId) : true)
                                 &&
                                 ((!request.Filter.Date.Contains("") || request.Filter.Date != null) ? p.DateTime.Date.ToString().Contains(request.Filter.Date) : true)
                                 );

                var count = await query.CountAsync().ConfigureAwait(false);

                var list = await query.OrderByDescending(p => p.StatusId == (int)ESupplierOrderStatuses.Pendiente)
                                      .ThenBy(p => p.DateTime)
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
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_010_ERROR_EXCEPTION), ex);
                throw;
            }
        }

    }

}
