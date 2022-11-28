using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Services;
using Kiltex.SistemaGestion.Api.Controllers;
using Microsoft.AspNetCore.Mvc;
using Kiltex.SistemaGestion.Api.Filter;
using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.Domain.Model;

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
        [AllowAccess(Permission = new EPermission[] { EPermission.ViewOrderSupplier })]
        public async Task<IActionResult> GetById(long id)
        {
            return Return(await _service.GetById(id));
        }
        [HttpPost]
        [AllowAccess(Permission = new EPermission[] { EPermission.CreateOrderSupplier })]
        public async Task<IActionResult> New([FromBody] DtoRequestSupplierOrder model)
        {
            return Return(await _service.AddOrUpdate(model).ConfigureAwait(false));
        }
        [HttpPut]
        [AllowAccess(Permission = new EPermission[] { EPermission.EditOrderSupplier })]
        public async Task<IActionResult> Edit([FromBody] DtoRequestSupplierOrder model)
        {
            return Return(await _service.AddOrUpdate(model).ConfigureAwait(false));
        }
        [HttpPost]
        [AllowAccess(Permission = new EPermission[] { EPermission.ViewOrderSupplier })]
        [Route("[action]")]
        public async Task<IActionResult> List([FromBody] RequestPaginatedData<ProductFilter> filter)
        {
            return Return(await _service.List(filter).ConfigureAwait(false));
        }
    }
}
