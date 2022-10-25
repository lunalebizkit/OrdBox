using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Models.Dtos;
using Kiltex.SistemaGestion.Services.Services;
using Kiltex.SitemaGestion.Api.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace Kiltex.SistemaGestion.Api.Controllers.SupplierOrder
{
    public class SupplierOrderController : ApiBaseController
    {
        private readonly SupplierOrderService _service;
        public SupplierOrderController(SupplierOrderService service)
        {
            _service = service;
        }
        [HttpGet]
        public async Task<IActionResult> GetById(long id)
        {
            return Return(await _service.GetById(id));
        }
        [HttpPost]
        public async Task<IActionResult> New([FromBody] DtoAddSupplierOrder model)
        {
            return Return(await _service.AddOrUpdate(model).ConfigureAwait(false));
        }
        [HttpPut]
        public async Task<IActionResult> Edit([FromBody] DtoAddSupplierOrder model)
        {
            return Return(await _service.AddOrUpdate(model).ConfigureAwait(false));
        }
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> List([FromBody] RequestPaginatedData<ProductFilter> filter)
        {
            return Return(await _service.List(filter).ConfigureAwait(false));
        }
    }
}
