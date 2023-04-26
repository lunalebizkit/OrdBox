using Kiltex.SistemaGestion.Api.Filter;
using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;
using Kiltex.SistemaGestion.Services.Services;
using Microsoft.AspNetCore.Mvc;

namespace Kiltex.SistemaGestion.Api.Controllers.Budget
{
    public class BudgetController : ApiBaseController
    {
        private readonly BudgetService _service;

        public BudgetController(BudgetService service)
        {
            _service = service;
        }

        [HttpPost]
        [Route("[action]")]
        [AllowAccess(Permission = new EPermission[] { EPermission.CreateBudget })]
        public async Task<IActionResult> New([FromBody] DtoRequestBudget model)
        {
            return Return(await _service.New(model).ConfigureAwait(false));
        }

        [HttpGet]
        [Route("[action]")]
        [AllowAccess(Permission = new EPermission[] { EPermission.GetBudget })]
        public async Task<IActionResult> Get(long id)
        {
            return Return(await _service.GetById(id).ConfigureAwait(false));
        }

        [HttpPut]
        [Route("[action]")]
        [AllowAccess(Permission = new EPermission[] { EPermission.GetBudget })]
        public async Task<IActionResult> Edit([FromBody] DtoRequestBudget model)
        {
            return Return(await _service.Update(model).ConfigureAwait(false));
        }

        [HttpPost]
        [Route("[action]")]
        [AllowAccess(Permission = new EPermission[] { EPermission.GetBudget })]
        public async Task<IActionResult> List([FromBody] RequestPaginatedData<string> filter)
        {
            return Return(await _service.ListBudget(filter).ConfigureAwait(false));
        }
     
    }
}
