using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Services;
using Kiltex.SistemaGestion.Api.Controllers;
using Microsoft.AspNetCore.Mvc;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.Api.Filter;

namespace Kiltex.SistemaGestion.Api.Controllers.Brand
{
    public class BrandController : ApiBaseController
    {
        private readonly BrandService _service;
        public BrandController(BrandService service)
        {
            _service = service;
        }

        /// <summary>
        /// Devuelve una Marca, buscando en la BASE DE DATOS por ID.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [AllowAccess(Permission = new EPermission[] { EPermission.ViewBrand })]
        public async Task<IActionResult> Get([FromQuery] long id)
        {
            return Return(await _service.GetById(id).ConfigureAwait(false));
        }

        /// <summary>
        /// Agrega una nueva Marca a la BASE DE DATOS.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [AllowAccess(Permission = new EPermission[] { EPermission.CreateBrand })]
        public async Task<IActionResult> New([FromBody] DtoResponseBrand model)
        {
            return Return(await _service.Add(model).ConfigureAwait(false));
        }

        /// <summary>
        /// Edita una Marca ya creada y la guarda modificada en la BASE DE DATOS.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut]
        [AllowAccess(Permission = new EPermission[] { EPermission.EditBrand })]
        public async Task<IActionResult> Edit([FromBody] DtoResponseBrand model)
        {
            return Return(await _service.Update(model).ConfigureAwait(false));
        }

        /// <summary>
        /// Devuelve un listado de Marcas creadas, con paginado.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("[action]")]
        [AllowAccess(Permission = new EPermission[] { EPermission.ViewBrand })]
        public async Task<IActionResult> List([FromBody] RequestPaginatedData<string> filter)
        {
            return Return(await _service.ListBrands(filter).ConfigureAwait(false));
        }
    }
}
