using AutoMapper;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;

namespace Kiltex.SistemaGestion.Services.Mapper
{
    public class DeliveryNotesMapperProfile : Profile
    {
        public DeliveryNotesMapperProfile()
        {
            CreateMap< DtoRequestDeliveryNotes,DeliveryNotes>()
            .AfterMap((o, d, c) =>
             {
                 d.ImportTotal = o.DeliveryNotesDetails.Sum(p => (p.Quantity * p.Price));
             });

            CreateMap<DeliveryNotes, DtoRequestDeliveryNotes>();

            CreateMap<DeliveryNotesDetails, DtoResponseDeliveryNotesDetail>().ReverseMap();
        }
    }
}
