using AutoMapper;
using Kiltex.SistemaGestion.Domain;
using Kiltex.SistemaGestion.Domain.Model.ImpresoraFiscal;
using Kiltex.SistemaGestion.SDK.Error;
using Kiltex.SistemaGestion.Services.Common;
using Newtonsoft.Json;
using System.Net;

namespace Kiltex.SistemaGestion.Services.Services
{
    public class PrinterConfigService : BaseService
    {
        public PrinterConfigService(ErrorManager logger, DBContext context, IMapper mapper) :
          base(logger, context, mapper)
        { }
        //public void Main(string[] args)
        //{
        //    string url = "http://192.168.100.87/fiscal.xml";
        //    string respuestaImprimir = GetImprimirItem(url);
        //    ImprimirDocumento imprimirDocumento = JsonConvert.DeserializeObject<ImprimirDocumento>(respuestaImprimir);

        //}
        public async Task<string> GetImprimirItem(string url)
        {
            try
            {
                WebRequest oRequest = WebRequest.Create(url);
                WebResponse oResponse = oRequest.GetResponse();
                StreamReader sr = new StreamReader(oResponse.GetResponseStream());
                return sr.ReadToEnd().Trim();
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }
        }
    }
}
