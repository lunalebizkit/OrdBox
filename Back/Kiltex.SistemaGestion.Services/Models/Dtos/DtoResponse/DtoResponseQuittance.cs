

namespace Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse
{
    public class DtoResponseQuittance
    {

        public int QuittanceNumber { get; set; }

        public string? CustomerName { get; set; }

        public string? CustomerAddress { get; set; }

        public string? CustomerCuit { get; set; }

        public DateTime DateTime { get; set; }

        public string? Money { get; set; }

        public string? Concept { get; set; }

        public string? Total { get; set; }

        public List<DtoResponseQuittanceDetails> QuittanceDetails { get; set; }
    }

    public class DtoResponseQuittanceDetails
    {
        public string? CheckNumber { get; set; }

        public string? Total { get; set; }

        public string? Bank { get; set; }
    }
}
