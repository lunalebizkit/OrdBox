using AutoMapper;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;

namespace Kiltex.SistemaGestion.Services.Mapper
{
    public class BrandMapperProfile : Profile
    {
        public BrandMapperProfile()
        {
            CreateMap<Brand, DtoResponseBrand>()
                .AfterMap((o, d, c) =>
                {
                    d.Description = d.Description.ToUpper();
                });
        }
    }
}
