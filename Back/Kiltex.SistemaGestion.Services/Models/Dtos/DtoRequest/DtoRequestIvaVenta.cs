using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest
{
    public class DtoRequestIvaVenta
    {
        public decimal TotalIva21 { get; set; }
        public decimal TotalIva10 { get; set; }
        public decimal TotalIva27 { get; set; }
        public decimal PeriodTotal { get; set; }

        public List<DtoRequestIvaVentaDetails> InvoiceDetails { get; set; }
    }
    public class DtoRequestIvaVentaDetails
    {
        public long Id { get; set; }
        public long InvoiceNumber { get; set; }
        public string CustomerName { get; set; }
        public string CustomerCuit { get; set; }
        public DateTime DateTime { get; set; }
        public decimal Total { get; set; }
        public decimal Iva { get; set; }
        public decimal Iva21 { get; set; }
        public decimal Iva27 { get; set; }
        public decimal Iva10 { get; set; }
        public int Type { get; set; }
    }
}
