using AutoMapper;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Services.Models.Dtos;


namespace Kiltex.SistemaGestion.Services.Mapper
{
    public class InvoiceMapperProfile : Profile
    {
        public InvoiceMapperProfile()
        {
            CreateMap<DtoInvoice, Invoice>()
                .AfterMap((o, d, c) =>
                {
                    d.Total = o.InvoiceDetails.Sum(p => (p.Quantity * p.Price));
                    d.IvaTotal = o.InvoiceDetails.Sum( e => (e.Quantity * e.Price) * e.Iva / 100.00m);                    
                });

            CreateMap<Invoice, DtoInvoice>();

            CreateMap<InvoiceDetail, DtoInvoiceDetail>().ReverseMap();
           
        }
    }
}
