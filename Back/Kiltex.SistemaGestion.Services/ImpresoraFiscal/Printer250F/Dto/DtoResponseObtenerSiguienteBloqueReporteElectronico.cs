using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;
using Newtonsoft.Json;

namespace Kiltex.SistemaGestion.Services.ImpresoraFiscal.Printer250F.Dto
{
    public class DtoResponseObtenerSiguienteBloqueReporteElectronico
    {
        [JsonProperty("ObtenerSiguienteBloqueReporteElectronico")]
        public DtoResponseObtenerReporteElectronicoBody BloqueElectronico {  get; set; }
    }
}
