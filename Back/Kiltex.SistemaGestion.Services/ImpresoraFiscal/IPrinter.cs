using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.Services.ImpresoraFiscal.Printer250F.Dto;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;

namespace Kiltex.SistemaGestion.Services.ImpresoraFiscal
{
    public enum eTypeDocumentClient
    {
        Cuit = 1,
        Cuil = 2,
        Dni = 3
    }

    public class ResultOpenInvoice
    {
        public string NroInvoice { get; set; }
    }



    public interface IPrinter
    {
        Task<string> OpenInvoice(ETypeReceipt type, string documentClient, eTypeDocumentClient typeDocument = eTypeDocumentClient.Cuil, string address = "");
        Task<string> OpenND(ETypeReceipt type, string documentClient, eTypeDocumentClient typeDocument = eTypeDocumentClient.Cuil, string address = "");

        Task<string> OpenNC(ETypeReceipt type, string documentClient, eTypeDocumentClient typeDocument = eTypeDocumentClient.Cuil, string address = "");

        Task<string> CerrarJornadaFiscal();
        Task<string> PrintItem(string articulo, double cantidad, decimal monto, decimal iva = 21, string codigo = "9999999");
        Task<string> CloseFactura( int copias = 1, string email = "");

        Task<string> CargarDatosCliente(string customerName, string customerCuit, string customerAddress, ETypeReceipt tipoDocumento );

        Task<string> ReimprimirDocumento( ETypeReceipt tipoDocumento,string numeroComprobante );
    }
}
