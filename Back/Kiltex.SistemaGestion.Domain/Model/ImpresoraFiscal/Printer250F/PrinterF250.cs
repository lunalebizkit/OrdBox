using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.Domain.Model.ImpresoraFiscal.Printer250F.Dto;
using Newtonsoft.Json;
using Simple.Interface;
using System.Net;
using System.Net.Mime;
using System.Text;

namespace Kiltex.SistemaGestion.Domain.Model.ImpresoraFiscal.Printer250F

{
    public class PrinterF250 : IPrinter
    {
        //public string OpenFacturaA(string url)
        //{
        //    var data = JsonConvert.SerializeObject(new AbrirDocumento { AbrirDocumentoBody = new AbrirDocumentoBody { CodigoComprobante = "TiqueFacturaA" } });
        //    WebClient client = new WebClient();
        //    client.Headers.Add("Content-Type", "application/json");
        //    var result = client.UploadString(url, data);
        //    return result;
        //}

        //public string OpenFacturaC(string url)
        //{
        //    var data = JsonConvert.SerializeObject(new AbrirDocumento { AbrirDocumentoBody = new AbrirDocumentoBody { CodigoComprobante = "TiqueFacturaC" } });
        //    WebClient client = new WebClient();
        //    client.Headers.Add("Content-Type", "application/json");
        //    var result = client.UploadString(url, data);
        //    return result;
        //}
        private readonly PrinterConfig _config;
        public PrinterF250(PrinterConfig config)
        {
            _config = config;
        }
      

        private async Task<T> RunCommand<T>(object request)
        {
            var data = JsonConvert.SerializeObject(request);
            using HttpClient client = new();
            client.DefaultRequestHeaders.Add("Content-Type", "application/json");
            
            var requestPrinter = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri(_config.Ip),
                Content = new StringContent(data, Encoding.UTF8, MediaTypeNames.Application.Json /* or "application/json" in older versions */),
            };

            var response = await client.SendAsync(requestPrinter).ConfigureAwait(false);
            response.EnsureSuccessStatusCode();

            var responseBody = await response.Content.ReadAsStringAsync().ConfigureAwait(false);

            return JsonConvert.DeserializeObject<T>(responseBody);
        }

        public async Task<ResultOpenInvoice> OpenInvoice(ETypeReceipt type, string documentClient, eTypeDocumentClient typeDocument, string address = "")
        {
            SetHeader(_config.Line1, _config.Line2, _config.Line3);

            var typeDocumemt = type switch
            {
                ETypeReceipt.C => "TiqueFacturaC",
                ETypeReceipt.A => "TiqueFacturaA",
                ETypeReceipt.B => "TiqueFacturaB",
                _ => throw new NotImplementedException()
            };

            var result = await  RunCommand<BaseEstado>(new AbrirDocumento { AbrirDocumentoBody = new AbrirDocumentoBody { CodigoComprobante = typeDocumemt } });

            return new ResultOpenInvoice
            {
                NroInvoice = ""
            };
        }

        public void SetHeader(string line1, string line2, string line3)
        {
            throw new NotImplementedException();
        }

        public Task<ResultOpenInvoice> OpenND(ETypeReceipt type, string documentClient, eTypeDocumentClient typeDocument, string address = "")
        {
            throw new NotImplementedException();
        }

        public Task<ResultOpenInvoice> OpenNC(ETypeReceipt type, string documentClient, eTypeDocumentClient typeDocument, string address = "")
        {
            throw new NotImplementedException();
        }

        public Task<bool> ReportZ()
        {
            throw new NotImplementedException();
        }

        public Task<bool> PrintItem(string articulo, double cantidad, double monto, double iva = 21, double impuesto = 0, string codigo = "9999999")
        {
            throw new NotImplementedException();
        }

        public Task<string> CloseFactura( int copias = 1, string Observacion = "")
        {
            throw new NotImplementedException();
        }

        public Task<string> ImprimirDocumento(string url)
        {
            throw new NotImplementedException();
        }
    }

}