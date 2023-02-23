using Kiltex.SistemaGestion.Api.Filter;
using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.SDK.Error;
using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;
using Kiltex.SistemaGestion.Services.Services;
using Microsoft.AspNetCore.Mvc;

namespace Kiltex.SistemaGestion.Api.Controllers.Receipt
{
    public class ReceiptController : ApiBaseController
    {
        private readonly ReceiptService _service;

        public ReceiptController(ReceiptService service)
        {
            _service = service;
        }

        /// <summary>
        /// Devuelve un Orden de Compra buscando en la BASE DE DATOS por ID.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [AllowAccess(Permission = new EPermission[] { EPermission.GetReceipt })]
        public async Task<IActionResult> GetById([FromQuery] long id)
        {
            return Return(await _service.GetById(id).ConfigureAwait(false));
        }

        /// <summary>
        /// Agrega una nueva Orden de Compra a la BASE DE DATOS.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [AllowAccess(Permission = new EPermission[] { EPermission.CreateReceipt })]
        public async Task<IActionResult> New([FromBody] DtoRequestReceipt model )
        {
            return Return(await _service.NewReceipt(model).ConfigureAwait(false));
        }

        /// <summary>
        /// Devuelve un listado de Ordenes de Compra creadas, con paginado.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("[action]")]
        [AllowAccess(Permission = new EPermission[] { EPermission.GetReceipt })]
        public async Task<IActionResult> List([FromBody] RequestPaginatedData<SpecificFilter> filter)
        {
            return Return(await _service.ListReceipt(filter).ConfigureAwait(false));
        }
    }
}
