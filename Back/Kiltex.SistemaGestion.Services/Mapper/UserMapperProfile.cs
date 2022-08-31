using AutoMapper;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Services.Dtos;
using Kiltex.SistemaGestion.Services.Models.Dtos;

namespace Kiltex.SistemaGestion.Services.Mapper
{
    public class UserMapperProfile : Profile
    {
        public UserMapperProfile()
        {
            CreateMap<User, RequestAddUser>().ReverseMap();
            CreateMap<User, DtoUser>().ReverseMap();
        }
    }
}
