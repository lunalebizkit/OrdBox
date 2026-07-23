using Kiltex.SistemaGestion.Api.Filter;
using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.Services.ARCA.Interface;
using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Services;
using Microsoft.AspNetCore.Mvc;

namespace Kiltex.SistemaGestion.Api.Controllers.DebitMemo
{
    public class DebitMemoController : ApiBaseController
    {
        private readonly DebitMemoService _service;
        private readonly IArcaIntegracion _arcaIntegracionService;
        private readonly IConfiguration _settingConfiguration;

        public DebitMemoController(DebitMemoService service, IArcaIntegracion arcaIntegracionService, IConfiguration configuration)
        {
            _service = service;
            _arcaIntegracionService = arcaIntegracionService;
            _settingConfiguration = configuration;
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
            var debitMemoId = await _service.Add(model).ConfigureAwait(false);

            if (debitMemoId.Success && debitMemoId.Data != null)
            {
                try
                {
                    await GetCAEInvoiceAsync(debitMemoId.Data.Id);
                }
                catch (Exception)
                {
                    return Return(debitMemoId);
                }
            }

            return Return(debitMemoId);
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

        /// <summary>
        /// Retorna el log de integración con ARCA de una factura específica, buscando por ID de la factura. Esto incluye detalles de la comunicación, errores y respuestas recibidas durante el proceso de integración.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("[action]")]
        [AllowAccess(Permission = new EPermission[] { EPermission.GetInvoice })]
        public async Task<IActionResult> GetIntegrationLogById(long id)
        {
            return Return(await _service.GetIntegrationLogById(id).ConfigureAwait(false));
        }
        #region PRIVATE

        private async Task<IActionResult> GetCAEInvoiceAsync(long id, DateTime? dateTime = null, string? observacion = null)
        {
            if (!bool.Parse(_settingConfiguration.GetSection("ArcaStatus:Status").Value))
            {
                return BadRequest("La impresora esta activada, desactive para realizar el llamado a ARCA");
            }

            var data = await _service.GetById(id).ConfigureAwait(false);

            if (data.Success && data.Data != null)
            {
                data.Data.DateTime = dateTime == null ? data.Data.DateTime : DateTime.Now;

                if (!string.IsNullOrEmpty(observacion)) { data.Data.Observation = observacion; }

                var responseCAE = await _arcaIntegracionService.CreateDebitNoteAsync(data.Data).ConfigureAwait(false);

                if (!string.IsNullOrEmpty(responseCAE.Cae) || responseCAE.InvoiceNumber > 0)
                {
                    return Return(await _service.Update(data.Data, responseCAE).ConfigureAwait(false));
                }
            }
            return BadRequest("No se encontro número de factura");
        }

        #endregion
    }
}
