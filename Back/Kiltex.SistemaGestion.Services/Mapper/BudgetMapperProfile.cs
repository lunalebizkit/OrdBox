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
            CreateMap<DtoRequestBudget, Budget>();
            CreateMap<DtoRequestBudgetDetail, BudgetDetail>().ReverseMap(); 
            //response
            CreateMap<Budget, DtoResponseBudget >().ForMember(o => o.UserId, c => c.MapFrom(i => i.User.UserName)); 
            CreateMap<DtoResponseBudgetDetail, BudgetDetail>().ReverseMap(); 


        }
    }
}
