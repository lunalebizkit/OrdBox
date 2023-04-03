using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Services;
using Kiltex.SistemaGestion.Api.Controllers;
using Microsoft.AspNetCore.Mvc;
using Kiltex.SistemaGestion.Api.Filter;
using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;

namespace Kiltex.SistemaGestion.Api.Controllers.Entity
{
    public class EntityController : ApiBaseController
    {
        private readonly EntityService _service;
        public EntityController(EntityService service)
        {
            _service = service;
        }
        /// <summary>
        /// Devuelve una Entidad buscando en la BASE DE DATOS por ID.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [AllowAccess(Permission = new EPermission[] { EPermission.ViewEntity })]
        public async Task<IActionResult> Get([FromQuery] long id)
        {
            return Return(await _service.GetById(id).ConfigureAwait(false));
        }

        /// <summary>
        /// Agrega una nueva Entidad a la BASE DE DATOS.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [AllowAccess(Permission = new EPermission[] { EPermission.CreateEntity })]
        public async Task<IActionResult> New([FromBody] DtoEntity model)
        {
            return Return(await _service.Add(model).ConfigureAwait(false));
        }

        /// <summary>
        /// Edita una Entidad ya creada y la guarda modificada en la BASE DE DATOS.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut]
        [AllowAccess(Permission = new EPermission[] { EPermission.EditEntity })]
        public async Task<IActionResult> Edit([FromBody] DtoEntity model)
        {
            return Return(await _service.Update(model).ConfigureAwait(false));
        }

        /// <summary>
        /// Devuelve un listado de Entidades creadas, con paginado.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        //[HttpPost]
        //[Route("[action]")]
        //[AllowAccess(Permission = new EPermission[] { EPermission.ViewEntity })]
        //public async Task<IActionResult> List([FromBody] RequestPaginatedData<string> filter)
        //{
        //    return Return(await _service.List(filter).ConfigureAwait(false));
        //}
}
}
