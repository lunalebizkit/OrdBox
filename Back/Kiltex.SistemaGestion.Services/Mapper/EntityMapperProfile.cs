using AutoMapper;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Services.Models.Dtos;


namespace Kiltex.SistemaGestion.Services.Mapper
{
    public class EntityMapperProfile : Profile
    {
         public EntityMapperProfile()
        {
            CreateMap<Customer, DtoEntity>()
            .ForMember(x => x.EmailEntity, o => o.MapFrom(x => x.EmailEntities))
            .ForMember(x => x.PhoneEntity, o => o.MapFrom(x => x.PhoneEntities));
            CreateMap<DtoEntity, Customer>();
            CreateMap<DtoSupplier, Supplier>().ReverseMap();
            CreateMap<Supplier,DtoEntityList>()
                 .ForMember(x => x.EmailEntity, o => o.MapFrom(x => x.EmailsStrings))
                 .ForMember(x => x.PhoneEntity, o => o.MapFrom(x => x.PhoneString));
            CreateMap<Customer, DtoEntityList>()
           .ForMember(x => x.EmailEntity, o => o.MapFrom(x => x.EmailsStrings))
           .ForMember(x => x.PhoneEntity, o => o.MapFrom(x => x.PhoneString));

        }
    }
}
