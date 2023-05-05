using AutoMapper;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;

namespace Kiltex.SistemaGestion.Services.Mapper
{
    public class UserMapperProfile : Profile
    {
        public UserMapperProfile()
        {
            CreateMap<User, RequestAddUser>().ReverseMap();
            CreateMap<User, DtoResponseUser>()
                .ForMember(i => i.RoleId, o => o.MapFrom(p => p.Rol.Key));
        }
    }
}
