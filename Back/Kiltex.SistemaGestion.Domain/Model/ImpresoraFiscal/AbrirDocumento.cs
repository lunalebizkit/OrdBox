
using System.Text.Json.Serialization;


namespace Kiltex.SistemaGestion.Domain.Model.ImpresoraFiscal
{
    public class AbrirDocumento
    {
        [JsonPropertyName("CodigoComprobante")]
        public string CodigoComprobante { get; set; }

    }
}
