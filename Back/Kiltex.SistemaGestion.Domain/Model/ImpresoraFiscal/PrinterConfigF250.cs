using Kiltex.SistemaGestion.Domain.Model.ImpresoraFiscal;
using Newtonsoft.Json;
using Simple.Interface;
using System.Net;

namespace Simple.Interface

{
    public class PrinterConfigF250 : IPrinter
    {
        public string OpenFacturaA(string url)
        {
            var data = JsonConvert.SerializeObject(new AbrirDocumento { AbrirDocumentoBody = new AbrirDocumentoBody { CodigoComprobante = "TiqueFacturaA" } });
            WebClient client = new WebClient();
            client.Headers.Add("Content-Type", "application/json");
            var result = client.UploadString(url, data);
            return result;
        }

        public string OpenFacturaC(string url)
        {
            var data = JsonConvert.SerializeObject(new AbrirDocumento { AbrirDocumentoBody = new AbrirDocumentoBody { CodigoComprobante = "TiqueFacturaC" } });
            WebClient client = new WebClient();
            client.Headers.Add("Content-Type", "application/json");
            var result = client.UploadString(url, data);
            return result;
        }
    }

}