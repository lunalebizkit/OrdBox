using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest
{
    public class DtoRequestReceipt
    {
        public long Id { get; set; }

        public long SupplierId { get; set; }

        public long UserId { get; set; }

        public long ReceiptNumber { get; set; }

        public string SupplierName { get; set; }

        public string SupplierCuit { get; set; }

        public string SupplierAddress { get; set; }

        public string? Observation { get; set; }

        public DateTime DateTime { get; set; }

        public decimal Total { get; set; }

        public decimal IvaTotal { get; set; }


        public decimal ConcNoGravado { get; set; }

        public decimal PercIva { get; set; }


        public decimal PercIngBrutos { get; set; }


        public int Type { get; set; }

        public List<DtoResponseReceiptDetail> ReceiptDetails { get; set; }
    }
}
