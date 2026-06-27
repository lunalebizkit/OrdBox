    using AutoMapper;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;

namespace Kiltex.SistemaGestion.Services.Mapper
{
    public class BudgetMapperProfile : Profile 
    {
        public BudgetMapperProfile()
        {
            CreateMap<DtoRequestBudget, Budget>()
                .ForMember(destination => destination.Observation, option => option.MapFrom(source => (string.IsNullOrEmpty(source.Observation) ? null : source.Observation.Trim())))
                .AfterMap((o,d,c) =>
                {
                    d.Total = d.BudgetDetails.Sum(p => (p.Price * p.Quantity));
                    d.IsInactive = false;
                });

            CreateMap<DtoRequestBudgetDetail, BudgetDetail>().ReverseMap();
            //response
            CreateMap<Budget, DtoResponseBudget>()
               .ForMember(o => o.UserId, c => c.MapFrom(i => i.User.UserName))
               .ForMember(o => o.Observation, x => x.MapFrom(source => (string.IsNullOrEmpty(source.Observation) ? null : source.Observation.Trim())));

            CreateMap<DtoResponseBudgetDetail, BudgetDetail>().ReverseMap(); 


        }
    }
}
