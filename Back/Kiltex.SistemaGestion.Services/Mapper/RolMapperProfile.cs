using AutoMapper;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Services.Dtos;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;

namespace Kiltex.SistemaGestion.Services.Mapper
{
    public class RolMapperProfile : Profile
    {
       public RolMapperProfile()
        {
            CreateMap<Rol, DtoResponseRol >().ReverseMap();
            CreateMap<RequestAddRol, DtoResponseRol >().ReverseMap();
            CreateMap<Permission, DtoResponsePermission>().ReverseMap();
            CreateMap<DtoRequestAddPermissionXRol, DtoResponsePermission>().ReverseMap();
        }
    }
}
