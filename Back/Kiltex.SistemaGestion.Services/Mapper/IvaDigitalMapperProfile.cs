using AutoMapper;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Services.LibroIvaDigital;

namespace Kiltex.SistemaGestion.Services.Mapper
{
    public class IvaDigitalMapperProfile : Profile
    {
        public IvaDigitalMapperProfile()
        {
            CreateMap<Invoice, ArchivosTxt>().AfterMap((o, d, c) =>
            {
                d.ArchivoTxtDto = c.Mapper.Map<List<ArchivoTxtDto>>(o.InvoiceDetails)
                ;
            });

            CreateMap<Invoice, ArchivoTxtDto>();
        }

    }
}
