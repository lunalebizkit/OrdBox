
using AutoMapper;
using Kiltex.SistemaGestion.Domain;
using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.SDK;
using Kiltex.SistemaGestion.SDK.Error;
using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Models.Dtos;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace Kiltex.SistemaGestion.Services.Services
{
    public class ProductService : BaseService
    {
        //private readonly ImageService _imageService;
        public ProductService(/*ImageService imageService,*/ ErrorManager logger, DBContext context, IMapper maper) :
            base(logger, context, maper)

        { }

        public async Task<OperationResponse<DtoProduct>> GetById(long id)
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

                return new OperationResponse<DtoProduct>(null, false, new OperationExceptions("000", $"Producto no encontrado {id}"));

            var result= _mapper.Map<DtoProduct>(producto);

            return new OperationResponse<DtoProduct>(result);
        }
        public async Task<OperationResponse<IdResponse<long>>> Add(DtoAddProduct model, CancellationToken ct = default)
        {
            model.Id = 0;
            return await AddOrUpdate(model, ct).ConfigureAwait(false);
        }

        public async Task<OperationResponse<IdResponse<long>>> AddOrUpdate(DtoAddProduct model, CancellationToken ct = default)
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

        public async Task<OperationResponse<DtoPagination<DtoProduct>>> List(RequestPaginatedData<string> request)
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


            var dto = _mapper.Map<List<DtoProduct>>(list);
    

            return new OperationResponse<DtoPagination<DtoProduct>>(new DtoPagination<DtoProduct>
            {
                Data = dto,
                PageSize = request.PageSize,
                TotalCount = count
            });
        }

        //Servicio que utlizamos para filtrar en UPDATEPRICEPRODUCT
        public async Task<OperationResponse<DtoPagination<DtoProduct>>> ListProduct(RequestPaginatedData<ProductFilter> request)
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


            var dto = _mapper.Map<List<DtoProduct>>(list);


            return new OperationResponse<DtoPagination<DtoProduct>>(new DtoPagination<DtoProduct>
            {
                Data = dto,
                PageSize = request.PageSize,
                TotalCount = count
            });
        }
        public async Task<OperationResponse<IdResponse<long>>> Update(DtoAddProduct model, CancellationToken ct = default)
        {
            if (model.Id == 0)
            {
                return Error<IdResponse<long>>("000", "El prodcuto no tiene ID");
            }
            return await AddOrUpdate(model, ct).ConfigureAwait(false);
        }

        public async Task<OperationResponse<bool>> UpdatePriceProduct(DtoUpdatePriceProduct model, CancellationToken ct = default)
        {
            if (model == null)
            {
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
                        item.UpdatePrecentage(model.Value, model.IdPrice);
                        break;
                }                    
                
            }
            await _contextSql.SaveChangesAsync(ct).ConfigureAwait(false);
            return Ok<bool>(true);
        }

       
    }
}
