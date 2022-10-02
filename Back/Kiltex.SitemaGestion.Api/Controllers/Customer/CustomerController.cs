using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Models.Dtos;
using Kiltex.SistemaGestion.Services.Services;
using Kiltex.SitemaGestion.Api.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace Kiltex.SistemaGestion.Api.Controllers.Customer
{
    public class CustomerController : ApiBaseController
    {
        private readonly EntityService _service;
        public CustomerController(EntityService service)
        {
            _service = service;
        }
        [HttpGet]
        //[AllowAccess(Rols = new string[] { ERol.Admin })]
        public async Task<IActionResult> Get([FromQuery] long id)
        {
            return Return(await _service.GetById(id).ConfigureAwait(false));
        }
        [HttpGet]
        [Route("[action]")]
        //[AllowAccess(Rols = new string[] { ERol.Admin })]
        public async Task<IActionResult> GetCustomerByCuit([FromQuery] string cuit)
        {
            return Return(await _service.GetCustomerByCuit(cuit).ConfigureAwait(false));
        }
        [HttpPost]
        [Route("[action]")]
        //[AllowAccess(Rols = new string[] { ERol.Admin })]
        public async Task<IActionResult> List([FromBody] RequestPaginatedData<string> filter)
        {
            return Return(await _service.List(filter).ConfigureAwait(false));
        }
        [HttpPost]
        public async Task<IActionResult> New([FromBody] DtoSupplier model)
        {
            return Return(await _service.Add(model).ConfigureAwait(false));
        }
        [HttpPut]
        //[AllowAccess(Rols = new string[] { ERol.Admin })]
        public async Task<IActionResult> Edit([FromBody] DtoEntity model)
        {
            return Return(await _service.Update(model).ConfigureAwait(false));
        }
    }
}
