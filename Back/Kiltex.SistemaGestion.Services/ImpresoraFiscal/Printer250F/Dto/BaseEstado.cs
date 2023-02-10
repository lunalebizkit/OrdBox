using Newtonsoft.Json;


namespace Kiltex.SistemaGestion.Services.ImpresoraFiscal.Printer250F.Dto
{

        public class Estado
        {
            [JsonProperty("Estado")]
            public Estadobody EstadoBody { get; set; }

            [JsonProperty("Secuencia")]
            public int Secuencia { get; set; }
        }

        public class Estadobody 
        {
         
            [JsonProperty("Impresora")]
            public string[] Impresora { get; set; }

            [JsonProperty("Fiscal")]
            public string[] Fiscal { get; set; }
        }
}
