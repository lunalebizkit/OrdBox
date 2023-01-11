using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse
{
    public class DtoResponseDebitMemoDetails
    {
        public long Id { get; set; }

        public long DebitMemoId { get; set; }

        public long ProductId { get; set; }

        public string? ProductName { get; set; }

        public int ProductCode { get; set; }

        public int Quantity { get; set; }

        public decimal Price { get; set; }

        public decimal Iva { get; set; }
    }
}
