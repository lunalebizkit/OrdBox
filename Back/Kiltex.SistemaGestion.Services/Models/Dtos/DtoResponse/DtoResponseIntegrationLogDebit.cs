namespace Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse
{
    public class DtoResponseIntegrationLogDebit
    {
        public int Id { get; set; }
        public int DebitId { get; set; }
        public string Request { get; set; }
        public string Response { get; set; }
        public string EndPoint { get; set; }
        public bool Success { get; set; }
        public DateTimeOffset CreatedOn { get; set; }
    }
}
