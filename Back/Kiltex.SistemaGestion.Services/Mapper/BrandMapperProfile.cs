using AutoMapper;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Services.Models.Dtos;

namespace Kiltex.SistemaGestion.Services.Mapper
{
    public class BrandMapperProfile : Profile
    {
        public BrandMapperProfile()
        {
            CreateMap<Brand, DtoBrand>().ReverseMap();
        }
    }
}
