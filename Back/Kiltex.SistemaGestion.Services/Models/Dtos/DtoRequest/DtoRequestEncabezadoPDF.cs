using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest
{
    public class DtoRequestEncabezadoPDF
    {
       
        string? TituloFacturaProforma { get; set; }
        string ? TituloFacturaCompra { get; set; }
        string ? TituloNotaDebito{ get;set; }
        string ? TituloNotaCredito{ get;set; }
        string? TituloPresupuesto { get; set; }
        string? TituloRemito { get; set; }
        string? TituloRecibo { get; set; }
        string? NumeroPresupuesto { get; set; }
        string? NumeroRemito { get; set; }
        string? NumeroRecibo { get; set; }


    }
}
