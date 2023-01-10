using AutoMapper;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kiltex.SistemaGestion.Services.Mapper
{
    public class DebitMemoMapperProfile : Profile
    {
        public DebitMemoMapperProfile()
        {
            CreateMap<DtoRequestDebitMemo, DebitMemo>()
                 .AfterMap((o, d, c) =>
                 {
                     d.Total = o.DebitMemoDetails.Sum(p => (p.Quantity * p.Price));
                     d.IvaTotal = o.DebitMemoDetails.Sum(e => (e.Quantity * e.Price) * e.Iva / 100.00m);
                     d.DateTime = o.DateTime = DateTime.Now;
                 });
            CreateMap<DebitMemo, DtoRequestDebitMemo>();
            CreateMap<DebitMemoDetails, DtoRequestDebitMemoDetails>().ReverseMap();
        }
    }
}
