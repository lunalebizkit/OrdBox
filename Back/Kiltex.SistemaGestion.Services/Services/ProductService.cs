
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
    public class ProductService : BaseService
    {
        //private readonly ImageService _imageService;
        public ProductService(/*ImageService imageService,*/ ErrorManager logger, DBContext context, IMapper maper) :
            base(logger, context, maper)

        { }

        public async Task<OperationResponse<DtoResponseProduct>> GetById(long id)
        {
            try
            {
                var producto = await _contextSql
                                    .Products
                                    .AsNoTracking()
                                    .Include(p => p.Category)
                                    .Include(p => p.Supplier)
                                    .Include(p => p.Brand)
                                    .FirstOrDefaultAsync(p => p.Id == id)
                                    .ConfigureAwait(false);
                if (producto == null)
                {
                    _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                    return Error<DtoResponseProduct>(new OperationExceptions("000", $"Producto no encontrado ID: {id}"));
                };

                var result= _mapper.Map<DtoResponseProduct>(producto);

                return new OperationResponse<DtoResponseProduct>(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }
        }
        public async Task<OperationResponse<IdResponse<long>>> Add(DtoRequestAddProduct model, CancellationToken ct = default)
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

        public async Task<OperationResponse<IdResponse<long>>> AddOrUpdate(DtoRequestAddProduct model, CancellationToken ct = default)
        {
            try
            {
                var productModel= _mapper.Map<Product>(model);

                if (productModel.Id == 0)
                {
                    await _contextSql.Products.AddAsync(productModel, ct).ConfigureAwait(false);
                }
                else
                {
                    var oldProduct = await _contextSql
                                    .Products
                                    .AsNoTracking()
                                    .FirstAsync(p => p.Id == productModel.Id)
                                    .ConfigureAwait(false);
                    _contextSql.Products.Update(productModel);
                }

                await _contextSql.SaveChangesAsync(ct).ConfigureAwait(false);

                return Ok(new IdResponse<long>(productModel.Id));
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }
        }

        public async Task<OperationResponse<DtoPagination<DtoResponseProduct>>> List(RequestPaginatedData<string> request)
        {
            try
            {
                var query = _contextSql
                                    .Products
                                    .AsNoTracking()
                                    .Include(p => p.Category)
                                    .Include(p => p.Brand)
                                    .Include(p => p.Supplier)
                                    .Where(p => (p.Description.ToLower().Contains(request.Filter ?? "") ||
                                    p.Category.Description.ToLower().Contains(request.Filter ?? "") ||              
                                    p.Supplier.Name.ToLower().Contains(request.Filter ?? "") ||
                                    p.Brand.Description.ToLower().Contains(request.Filter ?? "") ||
                                    p.Code.ToString().Contains(request.Filter ?? "")
                                    ));

                var count = await query.CountAsync().ConfigureAwait(false);

                var list = await query.OrderBy(p => p.Id)
                                      .Skip(request.Page * request.PageSize)
                                      .Take(request.PageSize)
                                      .ToListAsync()
                                      .ConfigureAwait(false);


                var dto = _mapper.Map<List<DtoResponseProduct>>(list);
    

                return new OperationResponse<DtoPagination<DtoResponseProduct>>(new DtoPagination<DtoResponseProduct>
                {
                    Data = dto,
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

        //Servicio que utlizamos para filtrar en UPDATEPRICEPRODUCT
        public async Task<OperationResponse<DtoPagination<DtoResponseProduct>>> ListProduct(RequestPaginatedData<ProductFilter> request)
        {
            try
            {
                var query = _contextSql
                                    .Products
                                    .AsNoTracking()
                                    .Include(p => p.Category)
                                    .Include(p => p.Brand)
                                    .Include(p => p.Supplier)
                                    .Where(p => (!string.IsNullOrEmpty(request.Filter.Product) ? p.Description.ToLower().Contains(request.Filter.Product) : true)
                                    &&
                                    ((request.Filter.Brand.HasValue && request.Filter.Brand != 0) ? p.BrandId == request.Filter.Brand : true)
                                    &&
                                     ((request.Filter.Category.HasValue && request.Filter.Category != 0) ? p.CategoryId == request.Filter.Category : true)
                                    &&
                                     (request.Filter.Supplier.Count > 0  ? request.Filter.Supplier.Contains(p.SupplierId) : true) );

                var count = await query.CountAsync().ConfigureAwait(false);

                var list = await query.OrderBy(p => p.Id)
                                      .Skip(request.Page * request.PageSize)
                                      .Take(request.PageSize)
                                      .ToListAsync()
                                      .ConfigureAwait(false);


                var dto = _mapper.Map<List<DtoResponseProduct>>(list);


                return new OperationResponse<DtoPagination<DtoResponseProduct>>(new DtoPagination<DtoResponseProduct>
                {
                    Data = dto,
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
        public async Task<OperationResponse<IdResponse<long>>> Update(DtoRequestAddProduct model, CancellationToken ct = default)
        {
            try
            {
                if (model.Id == 0)
                {
                    _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                    return Error<IdResponse<long>>(new OperationExceptions("000", "El prodcuto no tiene ID"));   
                }
                return await AddOrUpdate(model, ct).ConfigureAwait(false);

            }
            catch (Exception ex)    
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }
        }

        public async Task<OperationResponse<bool>> UpdatePriceProduct(DtoUpdatePriceProduct model, CancellationToken ct = default)
        {
            try
            {
                if (model == null)
                {
                    _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                    return Error<bool>("000", "El producto no tiene Id");
                }
                var productos = _contextSql
                                   .Products                               
                                   .Include(p => p.Category)
                                   .Include(p => p.Brand)
                                   .Include(p => p.Supplier)
                                   .Where(p => (!String.IsNullOrEmpty(model.Product) ? p.Description.ToLower().Contains(model.Product) : true)
                                   &&
                                   ((model.Brand.HasValue && model.Brand != 0) ? p.BrandId == model.Brand : true)
                                   &&
                                    ((model.Category.HasValue && model.Category != 0) ? p.CategoryId == model.Category : true)
                                   &&
                                    (model.Supplier.Count > 0 ? model.Supplier.Contains(p.SupplierId) : true));

            
                foreach (var item in productos) {
                    switch (model.IdPrice)
                    {
                        case (int)ePriceProduct.PurchasePrice:
                        case (int)ePriceProduct.Percentage:
                            item.UpdateSalePrice(model.Value, model.IdPrice == (int)ePriceProduct.Percentage);
                            break;
                        case (int)ePriceProduct.CardSalePercentage:
                        case (int)ePriceProduct.CashSalePercentage:
                        case (int)ePriceProduct.SalePercentage:
                            item.UpdatePrecentage(model.Value, model.IdPrice);
                            break;
                    }                    
                
                }
                await _contextSql.SaveChangesAsync(ct).ConfigureAwait(false);
                return Ok<bool>(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }
        }

       
    }
}
