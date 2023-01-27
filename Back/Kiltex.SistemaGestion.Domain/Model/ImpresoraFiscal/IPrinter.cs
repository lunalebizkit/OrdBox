

using Kiltex.SistemaGestion.Domain.Enum;

namespace Kiltex.SistemaGestion.Domain
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

        Task<bool> CargarDatosCliente();

        Task<ResultOpenInvoice> OpenInvoice(ETypeReceipt type, string documentClient, eTypeDocumentClient typeDocument = eTypeDocumentClient.Cuil, string address = "");

        Task<ResultOpenInvoice> OpenND(ETypeReceipt type, string documentClient, eTypeDocumentClient typeDocument = eTypeDocumentClient.Cuil, string address = "");

        Task<ResultOpenInvoice> OpenNC(ETypeReceipt type, string documentClient, eTypeDocumentClient typeDocument = eTypeDocumentClient.Cuil, string address = "");

        Task<bool> ReportZ();
        Task<bool> PrintItem(string articulo, double cantidad, double monto, double iva = 21, double impuesto = 0, string codigo = "9999999");
        Task<string> CloseFactura( int copias = 1, string Observacion = "");

        Task<string> ImprimirDocumento(string url);

    }
}
