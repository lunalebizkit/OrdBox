
using AutoMapper;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;

namespace Kiltex.SistemaGestion.Services.Mapper
{
    public class ProductMapperProfile : Profile
    {
        public ProductMapperProfile()
        {
            CreateMap<Product, DtoResponseProduct>()
                 .ForMember(x => x.CategoryName, o => o.MapFrom(y => y.Category.Description))
                 .ForMember(i => i.BrandName, u => u.MapFrom(a => a.Brand.Description))
                 .ForMember(i => i.SupplierName, u => u.MapFrom(a => a.Supplier.Name));
                 
            CreateMap<DtoResponseProduct, Product>();
            CreateMap<DtoRequestAddProduct, Product>().ReverseMap();
            
        }
    }
}
