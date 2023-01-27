using Kiltex.SistemaGestion.Api.Filter;
using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Domain.Model.ImpresoraFiscal;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Net;

namespace Kiltex.SistemaGestion.Api.Controllers.Printer
{
    public class PrinterController
    {
        //static void Main(string[] args)
        //{
        //    string url = "http://192.168.100.87/fiscal.xml";
        //    string respuestaImprimir = GetImprimirItem(url);
        //    string respuestaCerrarDoc = GetCerrarDoc(url);
        //    string respuestaAbrirDoc = GetAbirDoc(url);
        //    AbrirDocumento abrirDoc = JsonConvert.DeserializeObject<AbrirDocumento>(respuestaAbrirDoc);
        //    CerrarDocumento cerrarDoc = JsonConvert.DeserializeObject<CerrarDocumento>(respuestaCerrarDoc);
        //    ImprimirDocumento imprimirDocumento = JsonConvert.DeserializeObject<ImprimirDocumento>(respuestaImprimir);
        //}

        public string GetImprimirItem(string url)
        {
            var data = JsonConvert.SerializeObject(new AbrirDocumento { AbrirDocumentoBody = new AbrirDocumentoBody { CodigoComprobante = "TiqueFacturaB" } });
            WebClient client = new  WebClient();
            client.Headers.Add("Content-Type", "application/json");
            var result = client.UploadString(url, data);
            return result;
        }

        //public static string GetCerrarDoc(string url)
        //{
        //    WebRequest oRequest = new WebClient();
        //    WebResponse oResponse = oRequest.GetResponse();
        //    StreamReader sr = new StreamReader(oResponse.GetResponseStream());
        //    return sr.ReadToEnd().Trim();
        //}

        public static string GetAbirDoc(string url)
        {
            WebRequest oRequest = WebRequest.Create(url);
            WebResponse oResponse = oRequest.GetResponse();
            StreamReader sr = new StreamReader(oResponse.GetResponseStream());
            return sr.ReadToEnd().Trim();
        }

        public static string Get(string url)
        {
            WebRequest oRequest = WebRequest.Create(url);
            WebResponse oResponse = oRequest.GetResponse();
            StreamReader sr = new StreamReader(oResponse.GetResponseStream());
            return sr.ReadToEnd().Trim();
        }

    }
}
