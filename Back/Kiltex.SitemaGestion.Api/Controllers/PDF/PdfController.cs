
using iTextSharp.text;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kiltex.SistemaGestion.Api.Controllers.PDF
{
    public class PdfController : ApiBaseController
    {
        private readonly PdfService _service;


        public PdfController(PdfService service)
        {
            _service = service;
        }

        //COmprobante de Compra
        [HttpGet]
        [Route("PdfComprobanteVenta")]
        [AllowAnonymous]
        public async Task<IActionResult> PdfComprobanteVenta(long id, [FromServices] InvoiceService service)
        {
            var factura = await service.GetById(id);
            var dtoEncabezado = new DtoRequestEncabezadoPDF()
            {
                TituloComprobante = "Factura Proforma",
                NumeroComprobante = factura.Data.InvoiceNumber.ToString()

            };

            var dtoCabecera = new DtoRequestCabeceraPDF()
            {
                Cuit = factura.Data.CustomerCuit,
                Direccion = factura.Data.CustomerAddress,
                Nombre = factura.Data.CustomerName,
                Observacion = factura.Data.Observation,
                Fecha = factura.Data.DateTime,
                Tipo = factura.Data.Status
            };

            var dtoDetalle = new DtoRequestDetallePDF()
            {
                Detalle = factura.Data.InvoiceDetails,
                Cantidad = factura.Data.InvoiceDetails.Select(p => p.Quantity).FirstOrDefault(),
                Producto = factura.Data.InvoiceDetails.Select(p => p.ProductName).FirstOrDefault(),
                Iva10 = (int)factura.Data.Iva10,
                Iva21 = (int)factura.Data.Iva21,
                Iva27 = (int)factura.Data.Iva27,
                Precio = (int)factura.Data.InvoiceDetails.Select(p => p.Price).FirstOrDefault(),
                IvaTotal = (int)factura.Data.IvaTotal,
                Total = (int)factura.Data.Total

            };

            Paragraph encabezado = await _service.Encabezado(dtoEncabezado);
            Paragraph Cabecera = await _service.Cabecera(dtoCabecera);
            Paragraph Detalle = await _service.Detalle(dtoDetalle);
            Paragraph paragraph = new Paragraph();
            paragraph.Add(encabezado);
            paragraph.Add(Cabecera);
            paragraph.Add(Detalle);
            return Ok(await _service.Imprimir(paragraph));
        } 

        //COmprobante de venta
        [HttpGet]
        [Route("PdfComprobanteCompra")]
        [AllowAnonymous]
        public async Task<IActionResult> PdfComprobanteCompra(long id, [FromServices] ReceiptService service)
        {
            var factura = await service.GetById(id);
            var dtoEncabezado = new DtoRequestEncabezadoPDF()
            {
                TituloComprobante = "Comprobante De Venta",
                NumeroComprobante = factura.Data.ReceiptNumber.ToString()

            };

            var dtoCabecera = new DtoRequestCabeceraPDF()
            {
                Cuit = factura.Data.SupplierCuit,
                Direccion = factura.Data.SupplierAddress,
                Nombre = factura.Data.SupplierName,
                Fecha = factura.Data.DateTime,
                Observacion = factura.Data.Observation,
                Tipo = factura.Data.Type.ToString(),        
            };

            var dtoDetalle = new DtoRequestDetallePDF()
            {
                ReceiptDetails = factura.Data.ReceiptDetails,
                Cantidad = factura.Data.ReceiptDetails.Select(p => p.Quantity).FirstOrDefault(),
                Producto = factura.Data.ReceiptDetails.Select(p => p.ProductName).FirstOrDefault(),
                Iva10 = (int)factura.Data.Iva10,
                Iva21 = (int)factura.Data.Iva21,
                Iva27 = (int)factura.Data.Iva27,
                Precio = (int)factura.Data.ReceiptDetails.Select(p => p.Price).FirstOrDefault(),
                IvaTotal = (int)factura.Data.IvaTotal,
                Total = (int)factura.Data.Total
            };

            Paragraph encabezado = await _service.Encabezado(dtoEncabezado);
            Paragraph Cabecera = await _service.Cabecera(dtoCabecera);
            Paragraph Detalle = await _service.Detalle(dtoDetalle);
            Paragraph paragraph = new Paragraph();
            paragraph.Add(encabezado);
            paragraph.Add(Cabecera);
            paragraph.Add(Detalle);
            return Ok(await _service.Imprimir(paragraph));
        }

        //Presupuesto
        [HttpGet]
        [Route("PdfPresupuesto")]
        [AllowAnonymous]
        public async Task<IActionResult> PdfPresupuesto(long id, [FromServices] BudgetService service)
        {
            var factura = await service.GetById(id);
            var dtoEncabezado = new DtoRequestEncabezadoPDF()
            {
                TituloComprobante = "Presupuesto",
                NumeroComprobante = factura.Data.BudgetNumber.ToString()
            };

            var dtoCabecera = new DtoRequestCabeceraPDF()
            {
              
                Direccion = factura.Data.CustomerAddress,
                Cuit = null,
                Nombre = factura.Data.CustomerName,
                Fecha = factura.Data.DateTime,
                Observacion = factura.Data.Observation
            };

            var dtoDetalle = new DtoRequestDetallePDF()
            {
                BudgetDetails = factura.Data.BudgetDetails,
                Cantidad = factura.Data.BudgetDetails.Select(p => p.Quantity).FirstOrDefault(),
                Producto = factura.Data.BudgetDetails.Select(p => p.ProductName).FirstOrDefault(),
                Precio = (int)factura.Data.BudgetDetails.Select(p => p.Price).FirstOrDefault(),
                Total = (int)factura.Data.Total
            };

            Paragraph encabezado = await _service.Encabezado(dtoEncabezado);
            Paragraph Cabecera = await _service.Cabecera(dtoCabecera);
            Paragraph Detalle = await _service.Detalle(dtoDetalle);
            Paragraph paragraph = new Paragraph();
            paragraph.Add(encabezado);
            paragraph.Add(Cabecera);
            paragraph.Add(Detalle);
            return Ok(await _service.Imprimir(paragraph));
        }

        [HttpGet]
        [Route("PdfRemito")]
        [AllowAnonymous]
        public async Task<IActionResult> PdfRemito(long id, [FromServices] DeliveryNotesService service)
        {
            var factura = await service.GetById(id);
            var dtoEncabezado = new DtoRequestEncabezadoPDF()
            {
                TituloComprobante = "Remito",
                NumeroComprobante = factura.Data.DeliveryNotesNumber.ToString()
            };

            var dtoCabecera = new DtoRequestCabeceraPDF()
            {

                Direccion = factura.Data.SupplierAddress,
                Cuit = null,
                Nombre = factura.Data.SupplierName,
                Fecha = factura.Data.DateTime,
                Observacion = factura.Data.Observation
            };

            var dtoDetalle = new DtoRequestDetallePDF()
            {
                DeliveryNotesDetails = factura.Data.DeliveryNotesDetails,
                Cantidad = factura.Data.DeliveryNotesDetails.Select(p => p.Quantity).FirstOrDefault(),
                Producto = factura.Data.DeliveryNotesDetails.Select(p => p.ProductName).FirstOrDefault(),
                Precio = (int)factura.Data.DeliveryNotesDetails.Select(p => p.Price).FirstOrDefault(),
                Total = (int)factura.Data.ImportTotal,
                Iva = 0
            };

            Paragraph encabezado = await _service.Encabezado(dtoEncabezado);
            Paragraph Cabecera = await _service.Cabecera(dtoCabecera);
            Paragraph Detalle = await _service.Detalle(dtoDetalle);
            Paragraph paragraph = new Paragraph();
            paragraph.Add(encabezado);
            paragraph.Add(Cabecera);
            paragraph.Add(Detalle);
            return Ok(await _service.Imprimir(paragraph));
        }

        [HttpGet]
        [Route("PdfRecibo")]
        [AllowAnonymous]
        public async Task<IActionResult> PdfRecibo(long id, [FromServices] QuittanceService service)
        {
            var factura = await service.GetById(id);
            var dtoEncabezado = new DtoRequestEncabezadoPDF()
            {
                TituloComprobante = "Recibo",
                NumeroComprobante = factura.Data.QuittanceNumber.ToString()
            };

            var dtoCabecera = new DtoRequestCabeceraPDF()
            {

                Direccion = factura.Data.Address,
                Cuit = factura.Data.CustomerCuit,
                Nombre = factura.Data.CustomerName,
                Fecha = factura.Data.DateTime,
                Observacion = null
            };

            var dtoDetalle = new DtoRequestDetallePDF()
            {
                QuittanceDetails = factura.Data.QuittanceDetails,
                Banco = factura.Data.QuittanceDetails.Select(p => p.Bank).FirstOrDefault(),
                CheckNumber = factura.Data.QuittanceDetails.Select(p => p.CheckNumber).FirstOrDefault(),
                Concept = factura.Data.Concept,
                Cash = factura.Data.Cash,
                Total2 = factura.Data.Total
            };

            Paragraph encabezado = await _service.Encabezado(dtoEncabezado);
            Paragraph Cabecera = await _service.Cabecera(dtoCabecera);
            Paragraph Detalle = await _service.DetalleRecibo(dtoDetalle);
            Paragraph paragraph = new Paragraph();
            paragraph.Add(encabezado);
            paragraph.Add(Cabecera);
            paragraph.Add(Detalle);
            return Ok(await _service.Imprimir(paragraph));
        }
    }
}
