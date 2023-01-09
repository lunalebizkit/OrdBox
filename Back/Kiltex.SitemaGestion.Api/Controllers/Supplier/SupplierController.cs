using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Services;
using Kiltex.SistemaGestion.Api.Controllers;
using Microsoft.AspNetCore.Mvc;
using Kiltex.SistemaGestion.Api.Filter;
using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;

namespace Kiltex.SistemaGestion.Api.Controllers.Supplier
{
    public class SupplierController : ApiBaseController
    {
        private readonly EntityService _service;
        public SupplierController(EntityService service)
        {
            _service = service;
        }
        [HttpGet]
        [AllowAccess(Permission = new EPermission[] { EPermission.ViewSupplier })]
        public async Task<IActionResult> Get([FromQuery] long id)
        {
            return Return(await _service.GetSupplierById(id).ConfigureAwait(false));
        }
        [HttpPost]
        [Route("[action]")]
        [AllowAccess(Permission = new EPermission[] { EPermission.ViewSupplier })]
        public async Task<IActionResult> List([FromBody] RequestPaginatedData<string> filter)
        {
            return Return(await _service.ListSupplier(filter).ConfigureAwait(false));
        }
        [HttpPost]
        [AllowAccess(Permission = new EPermission[] { EPermission.CreateSupplier })]
        public async Task<IActionResult> New([FromBody] DtoSupplier model)
        {
            return Return(await _service.AddSupplier(model).ConfigureAwait(false));
        }
        [HttpPut]
        [AllowAccess(Permission = new EPermission[] { EPermission.EditSupplier })]
        public async Task<IActionResult> Edit([FromBody] DtoSupplier model)
        {
            return Return(await _service.UpdateSupplier(model).ConfigureAwait(false));
        }
        [HttpGet]
        [AllowAccess(Permission = new EPermission[] { EPermission.ViewSupplier })]
        [Route("[action]")]
        public async Task<IActionResult> GetSupplierByCuit([FromQuery] string cuit)
        {
            return Return(await _service.GetSupplierByCuit(cuit).ConfigureAwait(false));
        }
    }
}
