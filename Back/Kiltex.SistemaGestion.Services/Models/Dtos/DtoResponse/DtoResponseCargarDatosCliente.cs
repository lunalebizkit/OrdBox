using Kiltex.SistemaGestion.Services.ImpresoraFiscal.Printer250F.Dto;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse
{
    public class DtoResponseCargarDatosCliente
    {
        [JsonProperty("CargarDatosCliente")]
        public DtoResponseCargarDatosClienteBody Body { get; set; }
    }

    public class DtoResponseCargarDatosClienteBody : Estado
    {

    }
}
