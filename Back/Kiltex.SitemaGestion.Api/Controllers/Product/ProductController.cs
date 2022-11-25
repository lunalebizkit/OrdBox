using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Services;
using Kiltex.SistemaGestion.Api.Controllers;
using Microsoft.AspNetCore.Mvc;
using Kiltex.SistemaGestion.Api.Filter;
using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.Domain.Model;

namespace Kiltex.SistemaGestion.Api.Controllers.Product
{
    public class ProductController : ApiBaseController
    {
        private readonly ProductService _service;
        public ProductController(ProductService service)
        {
            _service = service;
        }
        [HttpGet]
        [AllowAccess(Permission = new EPermission[] { EPermission.CreateUser })]
        public async Task<IActionResult> GetById(long id)
        {
            return Return(await _service.GetById(id));
        }

        [HttpPost]
        [AllowAccess(Permission = new EPermission[] { EPermission.CreateProduct })]
        public async Task<IActionResult> New([FromBody] DtoRequestAddProduct model)
        {
            return Return(await _service.Add(model).ConfigureAwait(false));
        }
        [HttpPost]
        [AllowAccess(Permission = new EPermission[] { EPermission.ListProduct })]
        [Route("[action]")]
        public async Task<IActionResult> List([FromBody] RequestPaginatedData<string> filter)
        {
            return Return(await _service.List(filter).ConfigureAwait(false));
        }
        [HttpPut]
        [AllowAccess(Permission = new EPermission[] { EPermission.EditProduct })]
        public async Task<IActionResult> Edit([FromBody] DtoRequestAddProduct model)
        {
            return Return(await _service.Update(model).ConfigureAwait(false));
        }

     
    }
}
