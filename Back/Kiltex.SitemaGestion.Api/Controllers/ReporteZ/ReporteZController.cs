using Kiltex.SistemaGestion.Api.Filter;
using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Services.Services;
using Microsoft.AspNetCore.Mvc;

namespace Kiltex.SistemaGestion.Api.Controllers.ReporteZ
{
    public class ReporteZController : ApiBaseController
    {
        private readonly ReporteZService _service;

        public ReporteZController(ReporteZService service)
        {
            _service = service;
        }
        // GET: ReporteZController
        [HttpGet]
        [AllowAccess(Permission = new EPermission[] { EPermission.GetInvoice })]
        public async Task<IActionResult> CerrarJornadaFiscal()
        {
            return Return(await _service.ReporteZ().ConfigureAwait(false));
        }
    }
}
