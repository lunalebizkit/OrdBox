using Kiltex.SistemaGestion.Api.Filter;
using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Services;
using Microsoft.AspNetCore.Mvc;

namespace Kiltex.SistemaGestion.Api.Controllers.Quittance
{
    public class QuittanceController : ApiBaseController 
    {
        private readonly QuittanceService _service;
        public QuittanceController(QuittanceService service)
        {
            _service = service;
        }

        [HttpGet]
        [Route("[action]")]
        [AllowAccess(Permission = new EPermission[] { EPermission.GetQuittance })]
        public async Task<IActionResult> Get(long id)
        {
            return Return(await _service.GetById(id).ConfigureAwait(false));
        }

        [HttpPost]
        [Route("[action]")]
        [AllowAccess(Permission = new EPermission[] { EPermission.GetQuittance })]
        public async Task<IActionResult> List([FromBody] RequestPaginatedData<SpecificFilter> filter)
        {
            return Return(await _service.ListQuittance(filter).ConfigureAwait(false));
        }

        [HttpPost]
        [AllowAccess(Permission = new EPermission[] { EPermission.CreateQuittance })]
        public async Task<IActionResult> New([FromBody] DtoRequestQuittance model)
        {
            return Return(await _service.NewQuittance(model).ConfigureAwait(false));
        }

        [HttpPut]
        [AllowAccess(Permission = new EPermission[] { EPermission.CreateQuittance })]
        public async Task<IActionResult> Edit([FromBody] DtoRequestQuittance model)
        {
            return Return(await _service.Update(model).ConfigureAwait(false));
        }
    }
}
