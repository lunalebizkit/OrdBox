using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Services;
using Kiltex.SistemaGestion.Api.Controllers;
using Microsoft.AspNetCore.Mvc;
using Kiltex.SistemaGestion.Api.Filter;
using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;

namespace Kiltex.SistemaGestion.Api.Controllers.Product
{
    public class PeriodController : ApiBaseController
    {
        private readonly PeriodService _service;
        public PeriodController(PeriodService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] long id)
        {
            return Return(await _service.GetById(id).ConfigureAwait(false));
        }
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> ActivePeriod([FromQuery] DateTime date)
        {
            return Return(await _service.ActivePeriod(date).ConfigureAwait(false));
        }

        [HttpPost]
        public async Task<IActionResult> New([FromBody] DtoRequestPeriod model)
        {
            return Return(await _service.Add(model).ConfigureAwait(false));
        }
        [HttpPost]

        [Route("[action]")]
        public async Task<IActionResult> List([FromBody] RequestPaginatedData<string> filter)
        {
            return Return(await _service.ListPeriods(filter).ConfigureAwait(false));
        }
        [HttpPut]
        public async Task<IActionResult> Edit([FromBody] DtoRequestPeriod model)
        {
            return Return(await _service.Update(model).ConfigureAwait(false));
        }
        [HttpDelete]
        [Route("{id}")]
        //[AllowAccess(Permission = new EPermission[] { EPermission.DeleteUser })]
        public async Task<IActionResult> Delete(long id)
        {
            return Return(await _service.Delete(id).ConfigureAwait(false));
        }
       
    }  
}
