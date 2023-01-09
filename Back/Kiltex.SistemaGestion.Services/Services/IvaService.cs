using AutoMapper;
using ClosedXML.Excel;
using Google.Apis;
using Kiltex.SistemaGestion.Domain;
using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.SDK.Error;
using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace Kiltex.SistemaGestion.Services.Services
{
    public class IvaService : BaseService
    {
        public IvaService(ErrorManager logger, DBContext context, IMapper maper) :
            base(logger, context, maper)
        { }

        public async Task<OperationResponse<DtoResponseIvaInvoice>> ListIvaVenta(DateTime from, DateTime to, CancellationToken ct = default)
        {
            var query = _contextSql
                                    .Invoices
                                    .Include(p => p.InvoiceDetails)
                                    .Where(x => x.DateTime >= from && x.DateTime <= to)
                                    .AsNoTracking();

            var newDtoDetalleResumem = new List<DtoResponseIvaInvoices>();

            var resumen = new DtoResponseIvaInvoice();

            foreach (var item in query)
            {
                var newItem = _mapper.Map<DtoResponseIvaInvoices>(item);

                resumen.PeriodTotal += newItem.Total;
                newItem.ImporteNeto += newItem.Total - newItem.IvaTotal;
                foreach (var item2 in item.InvoiceDetails)
                {
                    newItem.Iva10 += ((decimal)item2.Iva == (decimal)10.5) ? (item2.Quantity * item2.Price * 10.5m) / 100.0m : 0;
                    newItem.Iva21 += ((decimal)item2.Iva == (decimal)21) ? (item2.Quantity * item2.Price * 21.0m) / 100.0m : 0;
                    newItem.Iva27 += ((decimal)item2.Iva == (decimal)27) ? (item2.Quantity * item2.Price * 27.0m) / 100.0m : 0;

                    newItem.ImporteNetoIva10 += ((decimal)item2.Iva == (decimal)10.5) ? ((item2.Price * item2.Quantity) - (item2.Quantity * item2.Price * 10.5m) / 100.0m) : 0;
                    newItem.ImporteNetoIva21 += ((decimal)item2.Iva == (decimal)21) ? ((item2.Price * item2.Quantity) - (item2.Quantity * item2.Price * 21.0m) / 100.0m) : 0;
                    newItem.ImporteNetoIva27 += ((decimal)item2.Iva == (decimal)27) ? ((item2.Price * item2.Quantity) - (item2.Quantity * item2.Price * 27.0m) / 100.0m) : 0;
                }


                newDtoDetalleResumem.Add(newItem);
            }
            resumen.DtoResponseIvaInvoices = newDtoDetalleResumem;

            return new OperationResponse<DtoResponseIvaInvoice>(resumen);

        }
        public async Task<OperationResponse<DtoResponseIvaReceipt>> ListIvaCompra(DateTime from, DateTime to, CancellationToken ct = default)
        {
            var query = _contextSql
                                    .Receipts
                                    .Include(p => p.ReceiptDetails)
                                    .Where(x => x.DateTime >= from && x.DateTime <= to)
                                    .AsNoTracking();

            var newDtoDetalleResumem = new List<DtoResponseIvaReceipts>();

            var resumen = new DtoResponseIvaReceipt();

            foreach (var item in query)
            {
                var newItem = _mapper.Map<DtoResponseIvaReceipts>(item);

                resumen.PeriodTotal += newItem.Total;
                newItem.ImporteNeto += newItem.Total - newItem.IvaTotal;
                foreach (var item2 in item.ReceiptDetails)
                {
                    newItem.Iva10 += ((decimal)item2.Iva == (decimal)10.5) ? (item2.Quantity * item2.Price * 10.5m) / 100.0m : 0;
                    newItem.Iva21 += ((decimal)item2.Iva == (decimal)21) ? (item2.Quantity * item2.Price * 21.0m) / 100.0m : 0;
                    newItem.Iva27 += ((decimal)item2.Iva == (decimal)27) ? (item2.Quantity * item2.Price * 27.0m) / 100.0m : 0;

                    newItem.ImporteNetoIva10 += ((decimal)item2.Iva == (decimal)10.5) ? ((item2.Price * item2.Quantity) - (item2.Quantity * item2.Price * 10.5m) / 100.0m) : 0;
                    newItem.ImporteNetoIva21 += ((decimal)item2.Iva == (decimal)21) ? ((item2.Price * item2.Quantity) - (item2.Quantity * item2.Price * 21.0m) / 100.0m) : 0;
                    newItem.ImporteNetoIva27 += ((decimal)item2.Iva == (decimal)27) ? ((item2.Price * item2.Quantity) - (item2.Quantity * item2.Price * 27.0m) / 100.0m) : 0;
                }


                newDtoDetalleResumem.Add(newItem);
            }
            resumen.DtoResponseIvaReceipts = newDtoDetalleResumem;

            return new OperationResponse<DtoResponseIvaReceipt>(resumen);

        }
        public async Task<OperationResponse<byte[]>> ReceiptIvaReport(DateTime from, DateTime to, CancellationToken ct = default)
        {
            var query = await _contextSql
                                .Receipts
                                .Include(s => s.ReceiptDetails)
                                .AsNoTracking()
                                .Where(x => x.DateTime >= from && x.DateTime <= to).ToArrayAsync();
            
            var newDtoDetalleResumem = new List<DtoResponseIvaReceipts>();

            var resumen = new DtoResponseIvaReceipt();

            foreach (var item in query)
            {
                var newItem = _mapper.Map<DtoResponseIvaReceipts>(item);

                resumen.PeriodTotal += newItem.Total;
                newItem.ImporteNeto += newItem.Total - newItem.IvaTotal;
                foreach (var item2 in item.ReceiptDetails)
                {
                    newItem.Iva10 += ((decimal)item2.Iva == (decimal)10.5) ? (item2.Quantity * item2.Price * 10.5m) / 100.0m : 0;
                    newItem.Iva21 += ((decimal)item2.Iva == (decimal)21) ? (item2.Quantity * item2.Price * 21.0m) / 100.0m : 0;
                    newItem.Iva27 += ((decimal)item2.Iva == (decimal)27) ? (item2.Quantity * item2.Price * 27.0m) / 100.0m : 0;

                    newItem.ImporteNetoIva10 += ((decimal)item2.Iva == (decimal)10.5) ? ((item2.Price * item2.Quantity) - (item2.Quantity * item2.Price * 10.5m) / 100.0m) : 0;
                    newItem.ImporteNetoIva21 += ((decimal)item2.Iva == (decimal)21) ? ((item2.Price * item2.Quantity) - (item2.Quantity * item2.Price * 21.0m) / 100.0m) : 0;
                    newItem.ImporteNetoIva27 += ((decimal)item2.Iva == (decimal)27) ? ((item2.Price * item2.Quantity) - (item2.Quantity * item2.Price * 27.0m) / 100.0m) : 0;
                }


                newDtoDetalleResumem.Add(newItem);
            }
            resumen.DtoResponseIvaReceipts = newDtoDetalleResumem;

            var workbook = new XLWorkbook();

            var worksheet = workbook.Worksheets.Add("Reporte Iva");
            var currentRow = 2;

            #region Header Columnas       
              
            worksheet.Cell(currentRow, 1).Value = "Fecha";
            worksheet.Cell(currentRow, 2).Value = " N° Factura";
            worksheet.Cell(currentRow, 3).Value = "Tipo";
            worksheet.Cell(currentRow, 4).Value = "Cliente";
            worksheet.Cell(currentRow, 5).Value = "CUIT / CUIL";
            worksheet.Cell(currentRow, 6).Value = "Imp.Neto";
            worksheet.Cell(currentRow, 7).Value = "IVA 10,5 %";
            worksheet.Cell(currentRow, 8).Value = "IVA 21 % ";
            worksheet.Cell(currentRow, 9).Value = "IVA 27 %";
            worksheet.Cell(currentRow, 10).Value = "Total";
            #endregion

            #region Body
            foreach (var item in resumen.DtoResponseIvaReceipts)
            {
                currentRow++;
                worksheet.Cell(currentRow, 1).Value = item.DateTime.ToString("MM/dd/yyyy");
                worksheet.Cell(currentRow, 2).Value = item.InvoiceNumber;
                worksheet.Cell(currentRow, 3).Value = (ETypeReceipt)item.Type ;
                worksheet.Cell(currentRow, 4).Value = item.SupplierName;
                worksheet.Cell(currentRow, 5).Value = item.SupplierCuit;
                worksheet.Cell(currentRow, 6).Value ={item.ImporteNeto};
                worksheet.Cell(currentRow, 7).Value =item.Iva10 == 0 ? null : string.Format("{0,7:##.00}", item.Iva10);
                worksheet.Cell(currentRow, 8).Value = item.Iva21 == 0 ? null : string.Format("{0,7:##.00}", item.Iva21);
                worksheet.Cell(currentRow, 9).Value = item.Iva27 == 0 ? null : string.Format("{0,7:##.00}", item.Iva27);
                worksheet.Cell(currentRow, 10).Value = "$ " + $"{ item.Total }";
            }
            #endregion
            currentRow+= 2;
            worksheet.Cell(currentRow, 9).Value= "Total Periodo";
            worksheet.Cell(currentRow, 10).Value= "$ " + $"{resumen.PeriodTotal}";

            var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return new OperationResponse<byte[]>(stream.ToArray());
        }
    }
}
