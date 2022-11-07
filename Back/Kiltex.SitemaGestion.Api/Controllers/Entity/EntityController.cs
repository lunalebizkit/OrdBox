using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Models.Dtos;
using Kiltex.SistemaGestion.Services.Services;
using Kiltex.SistemaGestion.Api.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace Kiltex.SistemaGestion.Api.Controllers.Entity
{
    public class EntityController : ApiBaseController
    {
        private readonly EntityService _service;
        public EntityController(EntityService service)
        {
            _service = service;
        }
        [HttpGet]
        //[AllowAccess(Rols = new string[] { ERol.Admin })]
        public async Task<IActionResult> Get([FromQuery] long id)
        {
            return Return(await _service.GetById(id).ConfigureAwait(false));
        }
        [HttpPost]
        public async Task<IActionResult> New([FromBody] DtoEntity model)
        {
            return Return(await _service.Add(model).ConfigureAwait(false));
        }
        [HttpPut]
        //[AllowAccess(Rols = new string[] { ERol.Admin })]
        public async Task<IActionResult> Edit([FromBody] DtoEntity model)
        {
            return Return(await _service.Update(model).ConfigureAwait(false));
        }
        [HttpPost]
        [Route("[action]")]
        //[AllowAccess(Rols = new string[] { ERol.Admin })]
        public async Task<IActionResult> List([FromBody] RequestPaginatedData<string> filter)
        {
            return Return(await _service.List(filter).ConfigureAwait(false));
        }
    }
}
