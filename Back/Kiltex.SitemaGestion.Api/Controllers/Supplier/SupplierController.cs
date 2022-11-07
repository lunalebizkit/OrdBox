using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Models.Dtos;
using Kiltex.SistemaGestion.Services.Services;
using Kiltex.SistemaGestion.Api.Controllers;
using Microsoft.AspNetCore.Mvc;

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
        //[AllowAccess(Rols = new string[] { ERol.Admin })]
        public async Task<IActionResult> Get([FromQuery] long id)
        {
            return Return(await _service.GetSupplierById(id).ConfigureAwait(false));
        }
        [HttpPost]
        [Route("[action]")]
        //[AllowAccess(Rols = new string[] { ERol.Admin })]
        public async Task<IActionResult> List([FromBody] RequestPaginatedData<string> filter)
        {
            return Return(await _service.ListSupplier(filter).ConfigureAwait(false));
        }
        [HttpPost]
        public async Task<IActionResult> New([FromBody] DtoSupplier model)
        {
            return Return(await _service.AddSupplier(model).ConfigureAwait(false));
        }
        [HttpPut]
        //[AllowAccess(Rols = new string[] { ERol.Admin })]
        public async Task<IActionResult> Edit([FromBody] DtoSupplier model)
        {
            return Return(await _service.UpdateSupplier(model).ConfigureAwait(false));
        }
    }
}
