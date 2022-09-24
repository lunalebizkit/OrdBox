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
                });

            CreateMap<Invoice, DtoInvoice>();

            CreateMap<InvoiceDetail, DtoInvoiceDetail>().ReverseMap();
           
        }
    }
}
