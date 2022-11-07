using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Models.Dtos;
using Kiltex.SistemaGestion.Services.Services;
using Kiltex.SistemaGestion.Api.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace Kiltex.SistemaGestion.Api.Controllers.UpdatePriceProduct
{
    public class UpdatePriceProductController : ApiBaseController
    {
        private readonly ProductService _service;
        public UpdatePriceProductController(ProductService service)
        {
            _service = service;
        }
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> List([FromBody] RequestPaginatedData<ProductFilter> filter)
        {
            return Return(await _service.ListProduct(filter).ConfigureAwait(false));
        }
        [HttpPut]
        [Route("[action]")]
        public async Task<IActionResult> UpdatePriceProduct([FromBody] DtoUpdatePriceProduct model)
        {

            return Return(await _service.UpdatePriceProduct(model).ConfigureAwait(false));
        }
    }
}
