using AutoMapper;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;

namespace Kiltex.SistemaGestion.Services.Mapper
{
    public class QuittanceMapperProfile : Profile
    {
        public QuittanceMapperProfile()
        {
            CreateMap<DtoRequestQuittance, Quittance>()
                .AfterMap((o, d, c) =>
                {
                    d.Total = o.QuittanceDetails.Sum(p => p.Total) + d.Cash + o.QuittanceProductDetails.Sum(o => o.Quantity * o.Price);
                });

            CreateMap<DtoRequesQuittanceDetails, QuittanceDetails>().ReverseMap();
            CreateMap<DtoRequestQuittanceProductDetail, QuittanceProductDetails>().ReverseMap();
            //response
            CreateMap<Quittance, DtoResponseQuittance>();

            CreateMap<QuittanceDetails, DtoResponseQuittanceDetails>().ReverseMap();
            CreateMap<QuittanceProductDetails, DtoResponseQuittanceProductDetail>().ReverseMap();
        }
    }
}
