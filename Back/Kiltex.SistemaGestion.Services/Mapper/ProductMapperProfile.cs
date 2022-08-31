
using AutoMapper;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Services.Models.Dtos;

namespace Kiltex.SistemaGestion.Services.Mapper
{
    public class ProductMapperProfile : Profile
    {
        public ProductMapperProfile()
        {
            CreateMap<Product, DtoProduct>()
                 .ForMember(x => x.CategoryName, o => o.MapFrom(y => y.Category.Description))
                 .ForMember(i => i.BrandName, u => u.MapFrom(a => a.Brand.Description))
                 .ForMember(i => i.SupplierName, u => u.MapFrom(a => a.Supplier.Name));
                 
            CreateMap<DtoProduct, Product>();
            CreateMap<DtoAddProduct, Product>()
                .ForMember( x => x.Supplier, o => o.MapFrom(y => y.Supplier));
        }
    }
}
