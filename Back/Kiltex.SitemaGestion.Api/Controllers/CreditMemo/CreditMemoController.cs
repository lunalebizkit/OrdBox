using Kiltex.SistemaGestion.Api.Filter;
using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Services;
using Microsoft.AspNetCore.Mvc;

namespace Kiltex.SistemaGestion.Api.Controllers.CreditMemoController
{
    public class CreditMemoController : ApiBaseController
    {
        private readonly CreditMemoService _service;
        public CreditMemoController(CreditMemoService service)
        {
            _service = service;
        }
        /// <summary>
        /// Devuelve una NC buscando en la BASE DE DATOS por ID.
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
        /// Devuelve un listado de NC creadas, con paginado y filtrado por CUIT.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        [HttpPost]
        [AllowAccess(Permission = new EPermission[] { EPermission.GetMemo })]
        [Route("[action]")]
        public async Task<IActionResult> List([FromBody] RequestPaginatedData<SpecificFilter> filter)
        {
            return Return(await _service.List(filter).ConfigureAwait(false));
        }
        /// <summary>
        /// Agrega una nueva NC a la BASE DE DATOS.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [AllowAccess(Permission = new EPermission[] { EPermission.CreateMemo })]
        public async Task<IActionResult> Post([FromBody] DtoRequestCreditMemo model)
        {
            return Return(await _service.NewMemo(model).ConfigureAwait(false));
        }
        /// <summary>
        /// Edita una NC ya creada y la guarda modificada en la BASE DE DATOS.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut]
        [AllowAccess(Permission = new EPermission[] { EPermission.CreateMemo })]
        public async Task<IActionResult> Edit([FromBody] DtoRequestCreditMemo model)
        {
            return Return(await _service.Update(model).ConfigureAwait(false));
        }
    }
}
