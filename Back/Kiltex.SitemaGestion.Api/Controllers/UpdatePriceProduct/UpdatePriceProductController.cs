using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Services;
using Kiltex.SistemaGestion.Api.Controllers;
using Microsoft.AspNetCore.Mvc;
using Kiltex.SistemaGestion.Api.Filter;
using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;

namespace Kiltex.SistemaGestion.Api.Controllers.UpdatePriceProduct
{
    public class UpdatePriceProductController : ApiBaseController
    {
        private readonly ProductService _service;
        public UpdatePriceProductController(ProductService service)
        {
            _service = service;
        }

        /// <summary>
        /// Devuelve un Producto filtrando por Nombre del Producto, Marca, Categoria, Estado y Proveedor.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        [HttpPost]
        [AllowAccess(Permission = new EPermission[] { EPermission.ListUpdatePrice })]
        [Route("[action]")]
        public async Task<IActionResult> List([FromBody] RequestPaginatedData<ProductFilter> filter)
        {
            return Return(await _service.ListProduct(filter).ConfigureAwait(false));
        }

        /// <summary>
        /// Selecciona un tipo de precio y le agrega al total el valor que se quiera colocar.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut]
        [AllowAccess(Permission = new EPermission[] { EPermission.EditUpdatePrice })]
        [Route("[action]")]
        public async Task<IActionResult> UpdatePriceProduct([FromBody] DtoUpdatePriceProduct model)
        {

            return Return(await _service.UpdatePriceProduct(model).ConfigureAwait(false));
        }
    }
}
