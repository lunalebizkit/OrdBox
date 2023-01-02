using AutoMapper;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;

namespace Kiltex.SistemaGestion.Services.Mapper
{
    public class IvaMapperProfile : Profile
    {
        public IvaMapperProfile()
        {
            CreateMap<Invoice, DtoResponseIvaInvoice>()
                .ForMember( o => o.PeriodTotal, x => x.MapFrom(y => y.Total))
                //.ForMember( o => o.DtoResponseIvaInvoices, x => x.MapFrom(y => y.InvoiceDetails.ToList()))
                .AfterMap((o, d, c) =>
                {
                    d.DtoResponseIvaInvoices = c.Mapper.Map<List<DtoResponseIvaInvoices>>(o.InvoiceDetails)
                    ;
                })
                ;
            CreateMap<Invoice, DtoResponseIvaInvoices>()
                ;
                
        }
    }
}
