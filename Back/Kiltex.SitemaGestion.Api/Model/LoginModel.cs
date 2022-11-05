using System.ComponentModel.DataAnnotations;

namespace Kiltex.SistemaGestion.Api.Model
{
    public class LoginModel
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        public string Password { get; set; }

        //[Required]
        public string Recaptcha { get; set; }
    }
}
