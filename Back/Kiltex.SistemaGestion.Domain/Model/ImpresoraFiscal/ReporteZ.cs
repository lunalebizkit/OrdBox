using System.Text.Json.Serialization;


namespace Kiltex.SistemaGestion.Domain.Model.ImpresoraFiscal
{
    public class ReporteZ
    {
        [JsonPropertyName("ZetaInicial")]
        public int ZetaInicial { get; set; }

        [JsonPropertyName("ZetaFinal")]
        public int ZetaFinal { get; set; }

        [JsonPropertyName("Reporte")]
        public string? Reporte { get; set; }

    }
}
