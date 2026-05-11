using Kiltex.SistemaGestion.Api.Filter;
using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Services;
using Microsoft.AspNetCore.Mvc;
using System.IO.Compression;

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
            var invoices = _service.GetInvoiceByDate(from, to);

            var ivaDigital = await _service.ArchivoTxt(invoices).ConfigureAwait(false);

            var ivaAlicuota = await _service.AlicuotaTxt(invoices).ConfigureAwait(false);

            if (ivaDigital.Data == null || ivaAlicuota.Data == null)
            {
                return BadRequest("Error generando los archivos.");
            }

            string folderPath = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
            // Ruta del ZIP
            var zipPath = Path.Combine(Path.GetTempPath(), $"LIBRO_IVA_DIGITAL_{from:yyyyMMdd}-{to:yyyyMMdd}.zip");
            try
            {

                Directory.CreateDirectory(folderPath);

                // Crear archivo 1
                string file1Path = Path.Combine(folderPath, $"LIBRO_IVA_DIGITAL_VENTAS_CBTE_{from:yyyyMMdd}-{to:yyyyMMdd}.txt");
                string file2Path = Path.Combine(folderPath, $"LIBRO_IVA_DIGITAL_VENTAS_ALICUOTAS_{from:yyyyMMdd}-{to:yyyyMMdd}.txt");

                // Guardar los archivos
                await System.IO.File.WriteAllBytesAsync(file1Path, ivaDigital.Data);
                await System.IO.File.WriteAllBytesAsync(file2Path, ivaAlicuota.Data);


                // Eliminar si ya existía
                if (System.IO.File.Exists(zipPath)) System.IO.File.Delete(zipPath);

                // Comprimir carpeta
                ZipFile.CreateFromDirectory(folderPath, zipPath);

                // Leer y retornar el ZIP
                var zipBytes = await System.IO.File.ReadAllBytesAsync(zipPath);
                return File(zipBytes, "application/zip", Path.GetFileName(zipPath));
            }
            finally
            {
                try
                {
                    if (Directory.Exists(folderPath))
                        Directory.Delete(folderPath, recursive: true);

                    if (System.IO.File.Exists(zipPath))
                        System.IO.File.Delete(zipPath);
                }
                catch
                {
                    // Opcional: loggear error de limpieza
                }
            }
        }

        [HttpGet]
        [Route("[action]")]
        [AllowAccess(Permission = new EPermission[] {EPermission.GetInvoice})]
        public async Task<IActionResult> AlicuotaIvaTxt([FromQuery] DateTime from, DateTime to)
        {
            var invoices = _service.GetInvoiceByDate(from, to);
            var content = await _service.AlicuotaTxt(invoices).ConfigureAwait(false);
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
        public async Task<IActionResult> InvoiceReport([FromBody] RequestPaginatedData<StoredProcedureFilter> filter)
        {
            return Return(await _service.InvoiceReport(filter).ConfigureAwait(false));
        }
    }
}
