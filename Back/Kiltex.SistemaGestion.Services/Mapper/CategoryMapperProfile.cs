using AutoMapper;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;

namespace Kiltex.SistemaGestion.Services.Mapper
{
    public class CategoryMapperProfile : Profile
    {
        public CategoryMapperProfile()
        {
            CreateMap<Category, DtoResponseCategory>()
                .AfterMap((o,d,c)=>
                {
                    d.Description = d.Description?.ToUpper();
                });

        }
    }
}
