using Kiltex.SistemaGestion.Domain.Model.ImpresoraFiscal;
using Newtonsoft.Json;

namespace Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse
{
    public  class DtoResponseAbrirDoc : BaseEstado
    {
        [JsonProperty("NumeroComprobante")]
        public string? NumeroComprobante { get; set; }

        [JsonProperty("IndiceAuditoria")]
        public int IndiceAuditoria { get; set; }

    }
}
