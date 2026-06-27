using AutoMapper;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;

namespace Kiltex.SistemaGestion.Services.Mapper
{
    public class IntegrationLogMapperProfile : Profile
    {
        public IntegrationLogMapperProfile()
        {
            CreateMap<DtoRequestIntegrationLog, IntegrationLog>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(source => 0));
        }
    }
}
