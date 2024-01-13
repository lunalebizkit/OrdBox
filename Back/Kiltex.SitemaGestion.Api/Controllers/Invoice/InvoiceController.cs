using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Services;
using Kiltex.SistemaGestion.Api.Controllers;
using Microsoft.AspNetCore.Mvc;
using Kiltex.SistemaGestion.Api.Filter;
using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.Services.LibroIvaDigital;
using System.Text;

namespace Kiltex.SistemaGestion.Api.Controllers.Invoice
{
    public class InvoiceController : ApiBaseController
    {
        private readonly InvoiceService _service;

        public InvoiceController(InvoiceService service)
        {
            _service = service;
        }

        /// <summary>
        /// Devuelve una Factura buscando en la BASE DE DATOS por ID.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [AllowAccess(Permission = new EPermission[] { EPermission.GetInvoice })]
        public async Task<IActionResult> Get(long id)
        {
            return Return(await _service.GetById(id).ConfigureAwait(false));
        }

        /// <summary>
        /// Genera un archivo TXT con todas los datos de las facturas necesarios para realizar un libro IVA Digital
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("[action]")]
        [AllowAccess(Permission = new EPermission[] { EPermission.GetInvoice })]
        public async Task<IActionResult> ArchivoTxt([FromQuery] DateTime from, DateTime to)
        {
            var content = await _service.ArchivoTxt(from, to).ConfigureAwait(false);
            return File(content.Data,"text/plain", $"ListaReporteLibroIvaVentas{DateTime.Now:dd-MM-yyyy-hh:mm:ss}.txt");
        }

        [HttpGet]
        [Route("[action]")]
        [AllowAccess(Permission = new EPermission[] {EPermission.GetInvoice})]
        public async Task<IActionResult> AlicuotaIvaTxt([FromQuery] DateTime from, DateTime to)
        {
            var content = await _service.AlicuotaTxt(from, to).ConfigureAwait(false);
            return File(content.Data, "text/plain", $"ListaReporteAlicuotaIva{DateTime.Now:dd-MM-yyyy-hh:mm:ss}.txt");
        }

        /// <summary>
        /// Devuelve un listado de Facturas creadas, con paginado.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("[action]")]
        [AllowAccess(Permission = new EPermission[] { EPermission.GetInvoice })]
        public async Task<IActionResult> List([FromBody] RequestPaginatedData<SpecificFilter> filter)
        {
            return Return(await _service.ListInvoices(filter).ConfigureAwait(false));
        }

        /// <summary>
        /// Agrega una nueva Factura a la BASE DE DATOS.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [AllowAccess(Permission = new EPermission[] { EPermission.CreateInvoice })]
        public async Task<IActionResult> New([FromBody] DtoRequestInvoice model)
        {
            return Return(await _service.NewInvoice(model).ConfigureAwait(false));
        }

        /// <summary>
        /// Devuelve un listado de Facturas creadas, con paginado.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("[action]")]
        [AllowAccess(Permission = new EPermission[] { EPermission.GetInvoice })]
        public async Task<IActionResult> InvoiceReport([FromBody] RequestPaginatedData<SpecificFilter> filter)
        {
            return Return(await _service.InvoiceReport(filter).ConfigureAwait(false));
        }
    }
}
