namespace Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest.PDF
{
    public class DtoRequestDetallePrintPDF
    {
        public string? ProductName { get; set; }

        public int Quantity { get; set; }

        public decimal Price { get; set; }

        public decimal Iva { get; set; }
    }
}
