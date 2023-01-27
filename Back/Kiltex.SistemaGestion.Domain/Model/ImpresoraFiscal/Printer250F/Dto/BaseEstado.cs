using System.Text.Json.Serialization;


namespace Kiltex.SistemaGestion.Domain.Model.ImpresoraFiscal.Printer250F.Dto
{
    public class BaseEstado
    {
        [JsonPropertyName("Impresora")]
        public object? Impresora { get; set; }

        [JsonPropertyName("Fiscal")]
        public object? Fiscal { get; set; }

    }
}
