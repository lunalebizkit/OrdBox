using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest
{
    public class DtoRequestDetallePDF
    {
        public string Producto { get ; set; }
        public int Cantidad { get; set; }
        public int Precio { get; set; }
        public int SubTotal { get; set; }
        public int Iva { get; set; }
        public int IvaTotal { get; set; }
        public int Total { get; set; }
        public int Quantity { get; set; }
        public int Iva10 { get; set; }
        public int Iva21 { get; set; }
        public int Iva27 { get; set; }

        public decimal ConcNoGravado { get; set; }

        public decimal PercIva { get; set; }

        public decimal PercIngBrutos { get; set; }

        public List<DtoResponseInvoiceDetail> Detalle { get; set; }
        public List<DtoResponseReceiptDetail> ReceiptDetails { get; set; }
        public List<DtoResponseBudgetDetail> BudgetDetails { get; set; }
        public List<DtoResponseDeliveryNotesDetail> DeliveryNotesDetails { get; set; }
        public List<DtoResponseQuittanceDetails> QuittanceDetails { get; set; }

        public string? CheckNumber { get; set; }

        public decimal? Total2 { get; set; }

        public string? Banco { get; set; }
        public string? Concept { get; set; }

        public decimal Cash { get; set; }

        public int Type { get; set; }

    }
}
