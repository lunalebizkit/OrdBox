namespace Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse
{
    public class DtoResponseInviocesReport
    {
        public DateTimeOffset Date {  get; set; }
        public string ProductName { get; set; }
        public string CustomerName { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal SubTotal { get; set; }
    }
}
