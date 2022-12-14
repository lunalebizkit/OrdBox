

using AutoMapper;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;

namespace Kiltex.SistemaGestion.Services.Mapper
{
    public class PeriodMapperProfile : Profile
    {
        public PeriodMapperProfile()
        {
            CreateMap<DtoRequestPeriod, Period>()
                .AfterMap((o, d, c) => {
                d.EndPeriod = o.EndPeriod.Date > o.InitPeriod.Date ? o.EndPeriod : o.EndPeriod.AddMonths(1).AddSeconds(-1);
        });
            CreateMap<Period, DtoResponsePeriod>();
        }
    }
}
