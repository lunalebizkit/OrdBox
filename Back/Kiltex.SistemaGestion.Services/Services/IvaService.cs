using AutoMapper;
using ClosedXML.Excel;
using DocumentFormat.OpenXml.Spreadsheet;
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
            MemoryStream stream= default;
            try
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
                var ColorHeader = XLColor.FromName("PowderBlue");

                #region Header Columnas       

                worksheet.Cell(currentRow, 1).SetValue("Fecha").Style.Font.Bold = true;
                worksheet.Cell(currentRow, 1).Style.Fill.BackgroundColor = ColorHeader;

                worksheet.Cell(currentRow, 2).SetValue(" N° Factura").Style.Font.Bold = true;
                worksheet.Cell(currentRow, 2).Style.Fill.BackgroundColor = ColorHeader;

                worksheet.Cell(currentRow, 3).SetValue("Tipo").Style.Font.Bold = true;
                worksheet.Cell(currentRow, 3).Style.Fill.BackgroundColor = ColorHeader;

                worksheet.Cell(currentRow, 4).SetValue("Cliente").Style.Font.Bold = true;
                worksheet.Cell(currentRow, 4).Style.Fill.BackgroundColor = ColorHeader;

                worksheet.Cell(currentRow, 5).SetValue("CUIT / CUIL").Style.Font.Bold = true;
                worksheet.Cell(currentRow, 5).Style.Fill.BackgroundColor = ColorHeader;

                worksheet.Cell(currentRow, 6).SetValue("Imp.Neto").Style.Font.Bold = true;
                worksheet.Cell(currentRow, 6).Style.Fill.BackgroundColor = ColorHeader;

                worksheet.Cell(currentRow, 7).SetValue("IVA 10,5 %").Style.Font.Bold = true;
                worksheet.Cell(currentRow, 7).Style.Fill.BackgroundColor = ColorHeader;

                worksheet.Cell(currentRow, 8).SetValue("IVA 21 % ").Style.Font.Bold = true;
                worksheet.Cell(currentRow, 8).Style.Fill.BackgroundColor = ColorHeader;

                worksheet.Cell(currentRow, 9).SetValue("IVA 27 %").Style.Font.Bold = true;
                worksheet.Cell(currentRow, 9).Style.Fill.BackgroundColor = ColorHeader;

                worksheet.Cell(currentRow, 10).SetValue("Total").Style.Font.Bold = true;
                worksheet.Cell(currentRow, 10).Style.Fill.BackgroundColor = ColorHeader;
                #endregion

                #region Body
                foreach (var item in resumen.DtoResponseIvaReceipts)
                {
                    currentRow++;
                    worksheet.Cell(currentRow, 1).SetValue(item.DateTime.ToString("MM/dd/yyyy")).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Left);
                    worksheet.Cell(currentRow, 2).SetValue(item.InvoiceNumber).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Left);
                    worksheet.Cell(currentRow, 3).SetValue((ETypeReceipt)item.Type).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                    worksheet.Cell(currentRow, 4).SetValue(item.SupplierName).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Left);
                    worksheet.Cell(currentRow, 5).SetValue(item.SupplierCuit).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Left);
                    worksheet.Cell(currentRow, 6).SetValue(item.ImporteNeto).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);
                    worksheet.Cell(currentRow, 7).SetValue(item.Iva10 == 0 ? null : string.Format("{0,7:##.00}", item.Iva10)).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);
                    worksheet.Cell(currentRow, 8).SetValue(item.Iva21 == 0 ? null : string.Format("{0,7:##.00}", item.Iva21)).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);
                    worksheet.Cell(currentRow, 9).SetValue(item.Iva27 == 0 ? null : string.Format("{0,7:##.00}", item.Iva27)).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);
                    worksheet.Cell(currentRow, 10).SetValue(item.Total).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right); ;
                }
                #endregion
                currentRow += 2;
                worksheet.Cell(currentRow, 9).SetValue("Total Periodo").Style.Font.Bold = true;
                worksheet.Cell(currentRow, 9).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Left);
                worksheet.Cell(currentRow, 9).Style.Fill.BackgroundColor = ColorHeader;

                worksheet.Cell(currentRow, 10).SetValue("$ " + $"{resumen.PeriodTotal}").Style.Font.Bold = true;
                worksheet.Cell(currentRow, 10).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);

                worksheet.Columns().AdjustToContents();

                stream = new MemoryStream();

                workbook.SaveAs(stream);

                workbook.Dispose();

                return new OperationResponse<byte[]>(stream.ToArray());
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }
            finally
            {
                if (stream != default)
                {
                    stream.Dispose();
                }
            }
            
        }
        public async Task<OperationResponse<byte[]>> InvoiceIvaReport(DateTime from, DateTime to, CancellationToken ct = default)
        {
            MemoryStream stream = default;
            try
            {
                var query = await _contextSql
                                .Invoices
                                .Include(s => s.InvoiceDetails)
                                .AsNoTracking()
                                .Where(x => x.DateTime >= from && x.DateTime <= to).ToArrayAsync();

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

                var workbook = new XLWorkbook();

                var worksheet = workbook.Worksheets.Add("Reporte Iva");
                var currentRow = 2;
                var ColorHeader = XLColor.FromName("PowderBlue");

                #region Header Columnas       

                worksheet.Cell(currentRow, 1).SetValue("Fecha").Style.Font.Bold = true;
                worksheet.Cell(currentRow, 1).Style.Fill.BackgroundColor = ColorHeader;

                worksheet.Cell(currentRow, 2).SetValue(" N° Factura").Style.Font.Bold = true;
                worksheet.Cell(currentRow, 2).Style.Fill.BackgroundColor = ColorHeader;

                worksheet.Cell(currentRow, 3).SetValue("Tipo").Style.Font.Bold = true;
                worksheet.Cell(currentRow, 3).Style.Fill.BackgroundColor = ColorHeader;

                worksheet.Cell(currentRow, 4).SetValue("Cliente").Style.Font.Bold = true;
                worksheet.Cell(currentRow, 4).Style.Fill.BackgroundColor = ColorHeader;

                worksheet.Cell(currentRow, 5).SetValue("CUIT / CUIL").Style.Font.Bold = true;
                worksheet.Cell(currentRow, 5).Style.Fill.BackgroundColor = ColorHeader;

                worksheet.Cell(currentRow, 6).SetValue("Imp.Neto").Style.Font.Bold = true;
                worksheet.Cell(currentRow, 6).Style.Fill.BackgroundColor = ColorHeader;

                worksheet.Cell(currentRow, 7).SetValue("IVA 10,5 %").Style.Font.Bold = true;
                worksheet.Cell(currentRow, 7).Style.Fill.BackgroundColor = ColorHeader;

                worksheet.Cell(currentRow, 8).SetValue("IVA 21 % ").Style.Font.Bold = true;
                worksheet.Cell(currentRow, 8).Style.Fill.BackgroundColor = ColorHeader;

                worksheet.Cell(currentRow, 9).SetValue("IVA 27 %").Style.Font.Bold = true;
                worksheet.Cell(currentRow, 9).Style.Fill.BackgroundColor = ColorHeader;

                worksheet.Cell(currentRow, 10).SetValue("Total").Style.Font.Bold = true;
                worksheet.Cell(currentRow, 10).Style.Fill.BackgroundColor = ColorHeader;
                #endregion

                #region Body
                foreach (var item in resumen.DtoResponseIvaInvoices)
                {
                    currentRow++;
                    worksheet.Cell(currentRow, 1).SetValue(item.DateTime.ToString("MM/dd/yyyy")).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Left);
                    worksheet.Cell(currentRow, 2).SetValue(item.InvoiceNumber).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Left);
                    worksheet.Cell(currentRow, 3).SetValue((ETypeReceipt)item.Type).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                    worksheet.Cell(currentRow, 4).SetValue(item.CustomerName).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Left);
                    worksheet.Cell(currentRow, 5).SetValue(item.CustomerCuit).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Left);
                    worksheet.Cell(currentRow, 6).SetValue(item.ImporteNeto).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);
                    worksheet.Cell(currentRow, 7).SetValue(item.Iva10 == 0 ? null : string.Format("{0,7:##.00}", item.Iva10)).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);
                    worksheet.Cell(currentRow, 8).SetValue(item.Iva21 == 0 ? null : string.Format("{0,7:##.00}", item.Iva21)).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);
                    worksheet.Cell(currentRow, 9).SetValue(item.Iva27 == 0 ? null : string.Format("{0,7:##.00}", item.Iva27)).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);
                    worksheet.Cell(currentRow, 10).SetValue(item.Total).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right); ;
                }
                #endregion
                currentRow += 2;
                worksheet.Cell(currentRow, 9).SetValue("Total Periodo").Style.Font.Bold = true;
                worksheet.Cell(currentRow, 9).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Left);
                worksheet.Cell(currentRow, 9).Style.Fill.BackgroundColor = ColorHeader;

                worksheet.Cell(currentRow, 10).SetValue("$ " + $"{resumen.PeriodTotal}").Style.Font.Bold = true;
                worksheet.Cell(currentRow, 10).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);

                worksheet.Columns().AdjustToContents();

                stream = new MemoryStream();

                workbook.SaveAs(stream);

                workbook.Dispose();

                return new OperationResponse<byte[]>(stream.ToArray());
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }
            finally
            {
                if (stream != default)
                {
                    stream.Dispose();
                }
            }

        }
    }
}
