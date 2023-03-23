using Kiltex.SistemaGestion.Api.Filter;
using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.Services.Services;
using Microsoft.AspNetCore.Mvc;

namespace Kiltex.SistemaGestion.Api.Controllers.Reimprimir
{
    public class ReimprimirController : ApiBaseController
    {
        private readonly ReimprimirDocService _service;

        public ReimprimirController(ReimprimirDocService service)
        {
            _service = service;
        }

        [HttpGet]
        [AllowAccess(Permission = new EPermission[] { EPermission.CreateInvoice })]
        public async Task<IActionResult> Reimprimir(ETypeReceipt tipoDocumento, string numeroComprobante)
        {
            return Return(await _service.ReimprmirDoc(tipoDocumento, numeroComprobante).ConfigureAwait(false));
        }
    }
}
