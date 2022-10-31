using AutoMapper;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;

namespace Kiltex.SistemaGestion.Services.Mapper
{
    public class OrderSupplierMapperProfile : Profile
    {
        public OrderSupplierMapperProfile()
        {
            CreateMap<SupplierOrder, DtoResponseSupplierOrder>()
                .ForMember(o => o.SupplierName, x => x.MapFrom(y => y.Supplier.Name))
            .AfterMap((o, d, c) =>
            {
                d.OrderDetail = c.Mapper.Map<List<DtoResponseOrderDetail>>(o.SupplierOrderDetail);
            });
            CreateMap<DtoRequestSupplierOrder, SupplierOrder>()
                .AfterMap((o, d,c)=> {
                    d.DateTime = o.DateTime=  DateTime.Now;
                    d.ScheduledDate = o.DateTime=  DateTime.Now;
                    d.SupplierOrderDetail = c.Mapper.Map<List<SupplierOrderDetail>>(o.OrderDetail);
                 });          
            CreateMap<SupplierOrderDetail, DtoResponseOrderDetail>()
                .ForMember( o => o.ProductId, x => x.MapFrom(y => y.Product.Description));
            CreateMap<DtoRequestSupplierOrder, SupplierOrderDetail>();

        }
    }
}
