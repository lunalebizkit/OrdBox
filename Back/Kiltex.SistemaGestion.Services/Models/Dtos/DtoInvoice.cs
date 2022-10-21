using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kiltex.SistemaGestion.Services.Models.Dtos
{
    public class DtoInvoice
    {
        public long Id { get; set; }

        public long CustomerId { get; set; }

        public long UserId { get; set; }

        public long InvoiceNumber { get; set; }

        public string CustomerName { get; set; }

        public string CustomerCuit { get; set; }

        public string CustomerAddress { get; set; }

        public string? Observation { get; set; }

        public DateTime DateTime { get; set; }
        
        public decimal Total { get; set; }

        public decimal IvaTotal { get; set; }

        public int Type { get; set; }

        public List<DtoInvoiceDetail> InvoiceDetails { get; set; }

    }
}
