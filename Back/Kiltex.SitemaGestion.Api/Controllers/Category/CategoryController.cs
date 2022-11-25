using Kiltex.SistemaGestion.Api.Filter;
using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;
using Kiltex.SistemaGestion.Services.Services;
using Microsoft.AspNetCore.Mvc;

namespace Kiltex.SistemaGestion.Api.Controllers.Category
{
    public class CategoryController : ApiBaseController
    {
        private readonly CategoryService _service;
        public CategoryController(CategoryService service)
        {
            _service = service;
        }
        [HttpGet]
        [AllowAccess(Permission = new EPermission[] { EPermission.GetCategory })]
        public async Task<IActionResult> Get([FromQuery] long id)
        {
            return Return(await _service.GetById(id).ConfigureAwait(false));
        }
        [HttpPost]
        [AllowAccess(Permission = new EPermission[] { EPermission.CreateCategory })]
        public async Task<IActionResult> New([FromBody] DtoResponseCategory model)
        {
            return Return(await _service.Add(model).ConfigureAwait(false));
        }
        [HttpPut]
        [AllowAccess(Permission = new EPermission[] { EPermission.EditCategory })]
        public async Task<IActionResult> Edit([FromBody] DtoResponseCategory model)
        {
            return Return(await _service.Update(model).ConfigureAwait(false));
        }
        [HttpPost]
        [AllowAccess(Permission = new EPermission[] { EPermission.ListCategory })]
        [Route("[action]")]
        public async Task<IActionResult> List([FromBody] RequestPaginatedData<string> filter)
        {
            return Return(await _service.ListCategory(filter).ConfigureAwait(false));
        }

    }
}
