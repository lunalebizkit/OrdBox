using AutoMapper;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;


namespace Kiltex.SistemaGestion.Services.Mapper
{
    public class ReceiptMapperProfile :Profile
    {
        public ReceiptMapperProfile()
        {
            CreateMap<DtoRequestReceipt, Receipt>()
                .AfterMap((o, d, c) =>
                {
                    d.Total = o.ReceiptDetails.Sum(p => (p.Quantity * p.Price));
                    d.IvaTotal = o.ReceiptDetails.Sum(e => (e.Quantity * e.Price) * e.Iva / 100.00m);
                });

            CreateMap<Receipt, DtoRequestReceipt>();

            CreateMap<ReceiptDetails, DtoResponseReceiptDetail>().ReverseMap();

        }
    }
}
