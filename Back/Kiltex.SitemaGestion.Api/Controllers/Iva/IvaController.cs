using Kiltex.SistemaGestion.Api.Filter;
using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Services.Services;
using Microsoft.AspNetCore.Mvc;

namespace Kiltex.SistemaGestion.Api.Controllers.Iva
{
    public class IvaController : ApiBaseController
    {
        private readonly IvaService _service;

        public IvaController(IvaService service)
        {
            _service = service;
        }

        [HttpGet]
        [Route("listIvaCompra")]
        [AllowAccess(Permission = new EPermission[] { EPermission.ListIva })]
        public async Task<IActionResult> ListCompra([FromQuery]DateTime from, DateTime to)
        {
            return Return(await _service.ListIvaCompra(from, to).ConfigureAwait(false));
        }
        [HttpGet]
        [Route("listIvaVenta")]
        [AllowAccess(Permission = new EPermission[] { EPermission.ListIva })]
        public async Task<IActionResult> ListVenta([FromQuery] DateTime from, DateTime to)
        {
            return Return(await _service.ListIvaVenta(from, to).ConfigureAwait(false));
        }
    }
}
