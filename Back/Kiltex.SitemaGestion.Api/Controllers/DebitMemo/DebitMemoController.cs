using Kiltex.SistemaGestion.Api.Filter;
using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Services;
using Microsoft.AspNetCore.Mvc;

namespace Kiltex.SistemaGestion.Api.Controllers.DebitMemo
{
    public class DebitMemoController : ApiBaseController
    {
        private readonly DebitMemoService _service;

        public DebitMemoController(DebitMemoService service)
        {
            _service = service;
        }

        /// <summary>
        /// Devuelve una ND, buscando en la BASE DE DATOS por ID.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [AllowAccess(Permission = new EPermission[] { EPermission.GetMemo })]
        public async Task<IActionResult> GetById([FromQuery] long id)
        {
            return Return(await _service.GetById(id).ConfigureAwait(false));
        }

        /// <summary>
        /// Agrega una nueva ND a la BASE DE DATOS.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [AllowAccess(Permission = new EPermission[] { EPermission.CreateMemo })]
        public async Task<IActionResult> New([FromBody] DtoRequestDebitMemo model)
        {
            return Return(await _service.Add(model).ConfigureAwait(false));
        }

        /// <summary>
        /// Edita una ND y la guarda modificada en la BASE DE DATOS.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut]
        [AllowAccess(Permission = new EPermission[] { EPermission.CreateMemo })]
        public async Task<IActionResult> Edit([FromBody] DtoRequestDebitMemo model)
        {
            return Return(await _service.Update(model).ConfigureAwait(false));
        }

        /// <summary>
        /// Devuelve un listado de ND creadas, con paginado.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("[action]")]
        [AllowAccess(Permission = new EPermission[] { EPermission.GetMemo })]
        public async Task<IActionResult> List([FromBody] RequestPaginatedData<SpecificFilter> filter)
        {
            return Return(await _service.List(filter).ConfigureAwait(false));
        }
    }
}
