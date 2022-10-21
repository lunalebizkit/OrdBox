using AutoMapper;
using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Services.Models.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kiltex.SistemaGestion.Services.Mapper
{
    public class OrderMapperProfile : Profile
    {
        public OrderMapperProfile()
        {
            CreateMap<DtoSupplierOrder, SupplierOrder>()
                .ForMember(o => o.Supplier, d => d.MapFrom(c => c.SupplierName))
            .AfterMap((o, d, c) =>
            {
                d.SupplierOrderDetail = c.Mapper.Map<List<SupplierOrderDetail>>(o.OrderDetail);
            });
            CreateMap<SupplierOrder, DtoSupplierOrder>()
            .AfterMap((o, d, c) =>
            {
                d.OrderDetail = c.Mapper.Map<List<DtoOrderDetail>>(o.SupplierOrderDetail);
            });
            CreateMap<DtoOrderDetail, SupplierOrderDetail>();
            CreateMap<SupplierOrderDetail, DtoOrderDetail>();
            CreateMap<DtoAddSupplierOrder, SupplierOrder>()
                .AfterMap((o, d, c) =>
                {
                    d.SupplierOrderDetail = c.Mapper.Map<List<SupplierOrderDetail>>(o.OrderDetail);
                }); 
            CreateMap<SupplierOrder, DtoAddSupplierOrder>()
                .AfterMap((o, d, c) =>
                {
                    d.OrderDetail = c.Mapper.Map<List<DtoAddOrderDetail>>(o.SupplierOrderDetail);
                });
            CreateMap<DtoAddOrderDetail, SupplierOrderDetail>();
            CreateMap<SupplierOrderDetail, DtoAddOrderDetail>();
        }
    }
}
