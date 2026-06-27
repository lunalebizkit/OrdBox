using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Services;
using Kiltex.SistemaGestion.Api.Controllers;
using Microsoft.AspNetCore.Mvc;
using Kiltex.SistemaGestion.Api.Filter;
using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.Domain.Model;

namespace Kiltex.SistemaGestion.Api.Controllers.DeliveryNotes
{
    public class DeliveryNotesController : ApiBaseController
    {
        private readonly DeliveryNotesService _service;

        public DeliveryNotesController(DeliveryNotesService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] long id)
        {
            return Return(await _service.GetById(id).ConfigureAwait(false));
        }

        [HttpPost]
        [Route("[action]")]
        [AllowAccess(Permission = new EPermission[] { EPermission.GetRemito })]
        public async Task<IActionResult> List([FromBody] RequestPaginatedData<SpecificFilter> filter)
        {
            return Return(await _service.ListDeliveryNotes(filter).ConfigureAwait(false));
        }

        [HttpPost]
        [AllowAccess(Permission = new EPermission[] { EPermission.CreateRemito })]
        public async Task<IActionResult> New([FromBody] DtoRequestDeliveryNotes model)
        {
            return Return(await _service.NewDeliveryNotes(model).ConfigureAwait(false));
        }

        [HttpPut]

        [AllowAccess(Permission = new EPermission[] { EPermission.CreateMemo })]
        public async Task<IActionResult> Edit([FromBody] DtoRequestDeliveryNotes model)
        {
            return Return(await _service.Update(model).ConfigureAwait(false));
        }

    }

}
