using Kiltex.SistemaGestion.Services.ImpresoraFiscal.Printer250F.Dto;
using Newtonsoft.Json;

namespace Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse
{
    public class DtoResponseCargarDatosCliente
    {
        [JsonProperty("CargarDatosCliente")]
        public DtoResponseCargarDatosClienteBody Body { get; set; }
    }

    public class DtoResponseCargarDatosClienteBody : BaseEstado
    {

    }
}
