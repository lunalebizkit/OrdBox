using AutoMapper;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;

namespace Kiltex.SistemaGestion.Services.Mapper
{
    public class RolMapperProfile : Profile
    {
       public RolMapperProfile()
        {
            CreateMap<Rol, DtoResponseRol >().ReverseMap();
            CreateMap<Rol, DtoResponsePermissionRol >()
                .ForMember( o => o.Rol, y => y.MapFrom(x => x.Name))
               .ForMember(o => o.Permissions, y => y.MapFrom(y => y.PermissionXRols.Select(p => p.Permission).ToList()));
            CreateMap<RequestAddRol, DtoResponseRol >().ReverseMap();
            CreateMap<Permission, DtoResponsePermission>().ReverseMap();
            CreateMap<DtoRequestAddPermissionXRol, DtoResponsePermission>().ReverseMap();
        }
    }
}
