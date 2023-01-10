using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest
{
    public class DtoRequestDebitMemo
    {
        public long Id { get; set; }
        [Required]
        public long ReceiptId { get; set; }

        public DateTime DateTime { get; set; }

        public long SupplierId { get; set; }

        public long UserId { get; set; }

        public int ReceiptNumber { get; set; }

        public string? SupplierName { get; set; }

        public string? SupplierCuit { get; set; }

        public string? SupplierAddress { get; set; }

        public string? Observation { get; set; }

        public decimal Total { get; set; }

        public decimal IvaTotal { get; set; }

        public decimal ConcNoGravado { get; set; }

        public decimal PercIva { get; set; }

        public decimal PercIngBrutos { get; set; }

        public int Type { get; set; }
        public List<DtoRequestDebitMemoDetails> DebitMemoDetails { get; set; }
    }
    public class DtoRequestDebitMemoDetails
    {
        public long ProductId { get; set; }

        public string? ProductName { get; set; }

        public int ProductCode { get; set; }

        public int Quantity { get; set; }

        public decimal Price { get; set; }

        public decimal Iva { get; set; }
    }
}
