
using AutoMapper;
using Kiltex.SistemaGestion.Domain;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.SDK;
using Kiltex.SistemaGestion.SDK.Error;
using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Models.Dtos;
using Microsoft.EntityFrameworkCore;

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

            var result = new DtoProduct()
            {
                Id = id,
                Description = producto.Description,
                Code = producto.Code,
                CategoryName = producto.Category.Description,
                BrandName = producto.Brand.Description,
                Quantity = producto.Quantity,
                PointOrder = producto.PointOrder,
                PurchasePrice = producto.PurchasePrice,
                SalePrice = producto.SalePrice,
                SalePercentage = producto.SalePercentage,
                CardSalePercentage = producto.CardSalePercentage,
                CardSalePrice = producto.CardSalePrice,
                CashSalePercentage= producto.CashSalePercentage,
                CashSalePrice = producto.CashSalePrice,
                SupplierName = producto.Supplier.Name,
                Observation = producto.Observation,
            };

            return new OperationResponse<DtoProduct>(result);
        }
        public async Task<OperationResponse<IdResponse<long>>> Add(DtoAddProduct model, CancellationToken ct= default)
        {
             model.Id = 0;
            return await AddOrUpdate(model, ct).ConfigureAwait(false);
        }

        public async Task<OperationResponse<IdResponse<long>>> AddOrUpdate(DtoAddProduct model, CancellationToken ct = default)
        {
            
            var productModel = new Product()
            {
                Id = model.Id,
                Description = model.Description,
                Code = model.Code,
                CategoryId = model.Category,
                BrandId = model.Brand,
                Quantity = model.Quantity,
                PurchasePrice = model.PurchasePrice,
                SalePrice = model.SalePrice,
                SalePercentage = model.SalePercentage,
                CardSalePrice = model.CardSalePrice,
                CardSalePercentage = model.CardSalePercentage,
                CashSalePrice = model.CashSalePrice,
                CashSalePercentage = model.CashSalePercentage,
                PointOrder= model.PointOrder,
                EntityId= model.Supplier,
                Observation= model.Observation,
                IsDeleted = false,
                //ImageUrl = model.ImageUrl,
                
            };
            if (productModel.Id == 0)
            {
                await _contextSql.Products.AddAsync(productModel, ct).ConfigureAwait(false);
            }
            else
            {
                var oldProduct= await _contextSql
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
                                .Where(p => (p.Description.ToLower().Contains(request.Filter ?? "") ||                      p.Category.Description.ToLower().Contains(request.Filter ?? "") ||              p.Supplier.Name.ToLower().Contains(request.Filter ?? "") ||
                                p.Brand.Description.ToLower().Contains(request.Filter ?? "")));

            var count = await query.CountAsync().ConfigureAwait(false);

            var list = await query.OrderBy(p => p.Id)
                                  .Skip(request.Page * request.PageSize)
                                  .Take(request.PageSize)
                                  .ToListAsync()
                                  .ConfigureAwait(false);


            var dto = _mapper.Map<List<DtoProduct>>(list);

            //var dto = list.Select(p => new DtoProduct()
            //{
            //    Id = p.Id,
            //    Description = p.Description,
            //    CategoryName = p.Category.Description,

            //});

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
    }
}
