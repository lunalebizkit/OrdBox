using AutoMapper;
using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;

namespace Kiltex.SistemaGestion.Services.Mapper
{
    public class DebitMemoMapperProfile : Profile
    {
        public DebitMemoMapperProfile()
        {
            CreateMap<DtoRequestDebitMemo, DebitMemo>()
                .ForMember(destination => destination.Version, option => option.MapFrom(source => CustomizationConstant.CurrentVersion))
                 .AfterMap((o, d, c) =>
                 {
                     d.Total = o.DebitMemoDetails.Sum(p => (p.Quantity * p.Price));
                     d.IvaTotal = o.DebitMemoDetails.Sum(e => (e.Quantity * e.Price) - ((e.Quantity * e.Price) / (1 + (e.Iva / 100.00m))));
                     d.DateTime = o.DateTime = DateTime.Now;
                 });
            CreateMap<DebitMemo, DtoRequestDebitMemo>();
            CreateMap<DebitMemoDetails, DtoResponseDebitMemoDetails>().ReverseMap();
        }
    }
}
