using Kiltex.SistemaGestion.Services.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kiltex.SistemaGestion.Api.Controllers.PDF
{
    public class PdfController : ApiBaseController
    {
        private readonly PdfService _service;


        public PdfController(PdfService service)
        {
            _service = service;
        }

        [HttpGet]
        [Route("[action]")]
        [AllowAnonymous]
        public async Task <IActionResult> Pdf()
        { 
           return Ok( await _service.Imprimir());
        }


    }
}
