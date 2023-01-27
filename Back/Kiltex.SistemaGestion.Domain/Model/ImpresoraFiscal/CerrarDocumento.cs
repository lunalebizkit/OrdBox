using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Kiltex.SistemaGestion.Domain.Model.ImpresoraFiscal
{

    public class CerrarDocumento
    {
        [JsonProperty("CerrarDocumento")]
        public CerrarDocumentoBody CerrarDocumentoBody { get; set; }
    }
    public class CerrarDocumentoBody
    {
        [JsonPropertyName("Copias")]
        public int Copias { get; set; }

        [JsonPropertyName("DireccionEmail")]
        public string? DireccionEmail { get; set; }

    }
}