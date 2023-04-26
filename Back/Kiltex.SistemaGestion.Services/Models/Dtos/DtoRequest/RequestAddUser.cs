
using System.ComponentModel.DataAnnotations;


namespace Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest
{
    public class RequestAddUser
    {
        [Required]
        public long Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string? FirstName { get; set; }

        [Required]
        [MaxLength(100)]
        public string? LastName { get; set; }

        [Required]
        [MaxLength(100)]
        public string? UserName { get; set; }

        [MaxLength(100)]
        public string? Password { get; set; }


        [MaxLength(200)]
        public string? Email { get; set; }

        [Required]
        public long RoleId { get; set; }
    }
}
