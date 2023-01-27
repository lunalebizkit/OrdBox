using Newtonsoft.Json;
using System.Text.Json.Serialization;


namespace Kiltex.SistemaGestion.Domain.Model.ImpresoraFiscal
{   

    public class ReportarZetasPorNumeroZeta
    {
        [JsonProperty("ReportarZetasPorNumeroZeta")]
        public ReportarZetasPorNumeroZetaBody ReportarZetasPorNumeroZetaBody { get; set; }
    }
    public class ReportarZetasPorNumeroZetaBody
    {
        [JsonPropertyName("ZetaInicial")]
        public int ZetaInicial { get; set; }

        [JsonPropertyName("ZetaFinal")]
        public int ZetaFinal { get; set; }

        [JsonPropertyName("Reporte")]
        public string? Reporte { get; set; }

    }
}