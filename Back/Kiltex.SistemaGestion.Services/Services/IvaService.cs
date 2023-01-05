using AutoMapper;
using Kiltex.SistemaGestion.Domain;
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
    }
}
