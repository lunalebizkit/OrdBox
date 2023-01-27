using Kiltex.SistemaGestion.Domain.Model.ImpresoraFiscal.Printer250F.Dto;
using Newtonsoft.Json;

namespace Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse
{
    public class DtoResponseImprimirItem : BaseEstado
    {
        [JsonProperty("IndiceAuditoria")]
        public int IndiceAuditoria { get; set; }

    }
}
