using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest
{
    public class DtoRequestIvaCompra
    {
        public decimal TotalIva21 { get; set; }
        public decimal TotalIva10 { get; set; }
        public decimal TotalIva27 { get; set; }
        public decimal? PeriodTotal { get; set; }

        public List<DtoRequestIvaCompraDetails> ReceiptDetails { get; set; }
    }
    public class DtoRequestIvaCompraDetails
    {
        public long Id { get; set; }
        public long ReceiptNumber { get; set; }
        public string SupplierName { get; set; }
        public string SupplierCuit { get; set; }
        public string SupplierAddress { get; set; }
        public DateTime DateTime { get; set; }
        public decimal? Total { get; set; }
        public decimal Iva { get; set; }
        public string IvaType { get; set; }
        public int Type { get; set; }
    }
}
