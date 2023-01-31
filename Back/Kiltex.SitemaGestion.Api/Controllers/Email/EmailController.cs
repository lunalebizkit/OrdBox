using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Services;
using Microsoft.AspNetCore.Mvc;

namespace Kiltex.SistemaGestion.Api.Controllers.Email
{
    public class EmailController : ApiBaseController
    {
        private readonly EmailService _service;
        public EmailController(EmailService service)
        {
            _service = service;
        }
        [HttpPost]
        public IActionResult SendEmail(string emailTo, string subject, string htmlBody, string plainBody = "")
        {
             _service.SendEmail(emailTo, subject, htmlBody, plainBody);
            return Ok();
        }
    }
}
