using Kiltex.SistemaGestion.Api.Filter;
using Kiltex.SistemaGestion.Domain.Enum;
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

        [HttpGet]
        public async Task<IActionResult> GetById([FromQuery] long id)
        {
            return Return(await _service.GetById(id).ConfigureAwait(false));
        }
        [HttpPost]
        public async Task<IActionResult> New([FromBody] DtoRequestDebitMemo model)
        {
            return Return(await _service.Add(model).ConfigureAwait(false));
        }
        [HttpPut]
        public async Task<IActionResult> Edit([FromBody] DtoRequestDebitMemo model)
        {
            return Return(await _service.Update(model).ConfigureAwait(false));
        }
    }
}
