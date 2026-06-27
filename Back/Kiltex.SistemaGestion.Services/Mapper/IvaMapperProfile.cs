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
                .AfterMap((o, d, c) =>
                {
                    d.DtoResponseIvaInvoices = c.Mapper.Map<List<DtoResponseIvaInvoices>>(o.InvoiceDetails)
                    ;
                })
                ;
            CreateMap<Invoice, DtoResponseIvaInvoices>()
                ;
            CreateMap<Receipt, DtoResponseIvaReceipt>()
               .ForMember(o => o.PeriodTotal, x => x.MapFrom(y => y.Total))
               .AfterMap((o, d, c) =>
               {
                   d.DtoResponseIvaReceipts = c.Mapper.Map<List<DtoResponseIvaReceipts>>(o.ReceiptDetails)
                   ;
               })
               ;
            CreateMap<Receipt, DtoResponseIvaReceipts>()
                ;

        }
    }
}
