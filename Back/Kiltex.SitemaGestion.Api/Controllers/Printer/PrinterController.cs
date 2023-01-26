using Kiltex.SistemaGestion.Domain.Model.ImpresoraFiscal;
using Newtonsoft.Json;
using System.Net;

namespace Kiltex.SistemaGestion.Api.Controllers.Printer
{
    public class PrinterController 
    {
        static void Main(string[] args)
        {
            string url = "http://192.168.100.87/fiscal.xml";
            string respuesta = GetImprimirItem(url);
            ImprimirDocumento oObject = JsonConvert.DeserializeObject<ImprimirDocumento>(respuesta);
        }

        public static string GetImprimirItem(string url)
        {
            WebRequest oRequest = WebRequest.Create(url);
            WebResponse oResponse = oRequest.GetResponse();
            StreamReader sr = new StreamReader(oResponse.GetResponseStream());
            return sr.ReadToEnd().Trim();
        }
    }
}
