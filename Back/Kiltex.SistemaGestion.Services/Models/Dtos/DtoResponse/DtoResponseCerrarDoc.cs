using Kiltex.SistemaGestion.Domain.Model.ImpresoraFiscal.Printer250F.Dto;
using Newtonsoft.Json;


namespace Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse
{
    public class DtoResponseCerrarDoc : BaseEstado
    {
        [JsonProperty("NumeroComprobante")]
        public string NumeroComprobante { get; set; }

        [JsonProperty("CantidadDePaginas")]
        public int CantidadDePaginas { get; set; }

        [JsonProperty("IndiceAuditoria")]
        public int IndiceAuditoria { get; set; }

    }
}
