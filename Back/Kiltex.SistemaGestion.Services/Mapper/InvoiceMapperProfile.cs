using AutoMapper;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;

namespace Kiltex.SistemaGestion.Services.Mapper
{
    public class InvoiceMapperProfile : Profile
    {
        public InvoiceMapperProfile()
        {
            CreateMap<DtoRequestInvoice, Invoice>()
                .AfterMap((o, d, c) =>
                {
                    d.Total = o.InvoiceDetails.Sum(p => (p.Quantity * p.Price));
                    d.IvaTotal = o.InvoiceDetails.Sum( e => e.Quantity * (e.Price -(e.Price / (1 + e.Iva / 100.00m))) );                    
                });

            CreateMap<Invoice, DtoRequestInvoice>();

            CreateMap<InvoiceDetail, DtoResponseInvoiceDetail>().ReverseMap();

            CreateMap<InvoiceSPReport, DtoResponseInviocesReport>().ReverseMap();

            CreateMap<InvoiceSPReportTotal, DtoResponseInvoiceReportTotals>().ReverseMap();

        }
    }
}
