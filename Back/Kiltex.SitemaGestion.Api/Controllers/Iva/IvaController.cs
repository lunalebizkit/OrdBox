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
        public async Task<IActionResult> ListCompra([FromQuery]DateTime from, DateTime to)
        {
            return Return(await _service.ListIvaCompra(from, to).ConfigureAwait(false));
        }
        [HttpGet]
        [Route("listIvaVenta")]
        public async Task<IActionResult> ListVenta(DateTime from, DateTime to)
        {
            return Return(await _service.ListIvaVenta(from, to).ConfigureAwait(false));
        }
    }
}
