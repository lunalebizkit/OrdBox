using Newtonsoft.Json;
using System.Text.Json.Serialization;


namespace Kiltex.SistemaGestion.Domain.Model.ImpresoraFiscal.Printer250F.Dto
{
    public class AbrirDocumento
    {
        [JsonProperty("AbrirDocumento")]
        public AbrirDocumentoBody AbrirDocumentoBody { get; set; }
    }
    public class AbrirDocumentoBody
    {
        [JsonProperty("CodigoComprobante")]
        public string CodigoComprobante { get; set; }
    }
}
