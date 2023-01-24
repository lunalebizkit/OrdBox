using hfl.argentina;
using AutoMapper;
using Kiltex.SistemaGestion.Domain;
using Kiltex.SistemaGestion.SDK.Error;
using static hfl.argentina.HasarImpresoraFiscalRG3561;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.ImpresoraFiscal;
using Kiltex.SistemaGestion.Domain.Model;

namespace Kiltex.SistemaGestion.Services.Services
{
    public class PrinterF250Service : BaseService
    {

        //ACA VA TODO LO QUE IMPLICA EL PROCESO DE IMPRESION DE UNA FACTURA, ABRIR DOCUMENT, IMPRIMIRLO Y CERRAR FACTURA.

        public PrinterF250Service(ErrorManager logger, DBContext context, IMapper maper) :
          base(logger, context, maper)
        { }
        public IPrinter funtion = new IPrinter();

        public async Task<bool> FacturaA(DtoRequestInvoice request)
        {
            funtion.OpenFacturaA(request.CustomerName, request.CustomerCuit, request.CustomerAddress)
        }
    }
}
