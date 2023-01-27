using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Kiltex.SistemaGestion.Domain.Model.ImpresoraFiscal
{
    public class ImprimirItem
    {
        [JsonProperty("ImprimirItem")]
        public ImprimirItemBody ImprimirItemBody { get; set; }
    }
    public class ImprimirItemBody
    {
        [JsonPropertyName("Descripcion")]
        public string Descripcion { get; set; }

        [JsonPropertyName("Cantidad")]
        public int Cantidad { get; set; }

        [JsonPropertyName("PrecioUnitario")]
        public double PrecioUnitario { get; set; }

        [JsonPropertyName("CondicionIVA")]
        public string CondicionIVA { get; set; }

        [JsonPropertyName("AlicuotaIVA")]
        public decimal AlicuotaIVA { get; set; }

        [JsonPropertyName("OperacionMonto")]
        public string OperacionMonto { get; set; }

        [JsonPropertyName("TipoImpuestoInterno")]
        public string TipoImpuestoInterno { get; set; }

        [JsonPropertyName("MagnitudImpuestoInterno")]
        public string MagnitudImpuestoInterno { get; set; }

        [JsonPropertyName("ModoDisplay")]
        public string ModoDisplay { get; set; }

        [JsonPropertyName("ModoBaseTotal")]
        public string ModoBaseTotal { get; set; }

        [JsonPropertyName("UnidadReferencia")]
        public int UnidadReferencia { get; set; }

        [JsonPropertyName("CodigoProducto")]
        public string CodigoProducto { get; set; }

        [JsonPropertyName("CodigoInterno")]
        public string CodigoInterno { get; set; }

        [JsonPropertyName("UnidadMedida")]
        public string UnidadMedida { get; set; }
    }
}
