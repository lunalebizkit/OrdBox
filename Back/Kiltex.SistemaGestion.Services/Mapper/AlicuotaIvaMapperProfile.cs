using AutoMapper;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Services.LibrosIvaDigital;

namespace Kiltex.SistemaGestion.Services.Mapper
{
    public  class AlicuotaIvaMapperProfile :Profile
    {
        public AlicuotaIvaMapperProfile()
        {
            CreateMap<Invoice, AlicuotaIva>().AfterMap((o, d, c) =>
            {
                d.AlicuotaIvaDto = c.Mapper.Map<List<AlicuotaIvaDto>>(o.InvoiceDetails)
                ;
            });

            CreateMap<Invoice, AlicuotaIvaDto>();
        }
    }
}
