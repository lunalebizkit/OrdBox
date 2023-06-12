using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest
{
    public class DtoRequestCabeceraPDF
    {
        public string Nombre { get; set; }
        public string Direccion { get; set; }
        public string Cuit { get; set; }
        public string ?Observacion { get; set; }
        public DateTime Fecha { get; set; }
        public string Tipo { get; set; }

    }
}
