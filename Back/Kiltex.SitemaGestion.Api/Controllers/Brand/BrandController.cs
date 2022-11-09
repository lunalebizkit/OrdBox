using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Services;
using Kiltex.SistemaGestion.Api.Controllers;
using Microsoft.AspNetCore.Mvc;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;

namespace Kiltex.SistemaGestion.Api.Controllers.Brand
{
    public class BrandController : ApiBaseController
    {
        private readonly BrandService _service;
        public BrandController(BrandService service)
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
        public async Task<IActionResult> New([FromBody] DtoResponseBrand model)
        {
            return Return(await _service.Add(model).ConfigureAwait(false));
        }
        [HttpPut]
        //[AllowAccess(Rols = new string[] { ERol.Admin })]
        public async Task<IActionResult> Edit([FromBody] DtoResponseBrand model)
        {
            return Return(await _service.Update(model).ConfigureAwait(false));
        }
        [HttpPost]
        [Route("[action]")]
        //[AllowAccess(Rols = new string[] { ERol.Admin })]
        public async Task<IActionResult> List([FromBody] RequestPaginatedData<string> filter)
        {
            return Return(await _service.ListBrands(filter).ConfigureAwait(false));
        }
    }
}
