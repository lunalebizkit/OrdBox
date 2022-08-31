using AutoMapper;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Services.Dtos;
using Kiltex.SistemaGestion.Services.Models.Dtos;

namespace Kiltex.SistemaGestion.Services.Mapper
{
    public class RolMapperProfile : Profile
    {
       public RolMapperProfile()
        {
            CreateMap<Rol, DtoRol >().ReverseMap();
            CreateMap<RequestAddRol, DtoRol >().ReverseMap();
            CreateMap<Permission, DtoPermission>().ReverseMap();
            CreateMap<RequestAddPermissionXRol, DtoPermission>().ReverseMap();
        }
    }
}
