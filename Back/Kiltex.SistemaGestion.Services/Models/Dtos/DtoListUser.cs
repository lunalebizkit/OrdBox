
namespace Kiltex.SistemaGestion.Services.Models.Dtos
{
    public class DtoListUser
    {
        public long Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string Role { get; set; }
    }
}
