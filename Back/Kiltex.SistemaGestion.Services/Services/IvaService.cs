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
                 
                    newItem.ImporteNetoIva10 += ((decimal)item2.Iva == (decimal)10.5) ? ((item2.Price * item2.Quantity) - (item2.Quantity * item2.Price * 10.5m) / 100.0m ) : 0;
                    newItem.ImporteNetoIva21 += ((decimal)item2.Iva == (decimal)21) ? ((item2.Price * item2.Quantity) - (item2.Quantity * item2.Price * 21.0m) / 100.0m ) : 0;
                    newItem.ImporteNetoIva27 += ((decimal)item2.Iva == (decimal)27) ? ((item2.Price * item2.Quantity) - (item2.Quantity * item2.Price * 27.0m) / 100.0m ) : 0;
                }


                newDtoDetalleResumem.Add(newItem);
            }
            resumen.DtoResponseIvaInvoices = newDtoDetalleResumem;
          
            return new OperationResponse<DtoResponseIvaInvoice>(resumen);   

        }
        public async Task<OperationResponse<DtoRequestIvaPeriodCompra>> ListIvaCompra(DateTime from, DateTime to, CancellationToken ct = default)
        {
            var query = _contextSql
                                    .Receipts
                                    .Include(p => p.ReceiptDetails)
                                    .Where(x => x.DateTime >= from && x.DateTime <= to)
                                    .AsNoTracking();
            var count = await query.CountAsync().ConfigureAwait(false);

            var list = await query.OrderBy(p => p.DateTime)
                                  .ToListAsync()
                                  .ConfigureAwait(false);
            decimal? totalAmount = 0;
            decimal? totalIva = 0;
            foreach (var item in list)
            {
                totalAmount += item.Total;

                foreach (var item2 in item.ReceiptDetails)
                {
                    totalIva += (((item2.Price * item2.Iva) / 100) * item2.Quantity);
                }
            }

            return new OperationResponse<DtoRequestIvaPeriodCompra>(new DtoRequestIvaPeriodCompra
            {
                PeriodTotal = totalAmount,
                Receipts = list.Select(x => new DtoRequestIvaCompra
                {
                    ReceiptNumber = x.ReceiptNumber,
                    SupplierName = x.SupplierName,
                    SupplierAddress = x.SupplierAddress,
                    SupplierCuit = x.SupplierCuit,
                    ConcNoGravado = x.ConcNoGravado,
                    PercIngBrutos = x.PercIngBrutos,
                    PercIva = x.PercIva,
                    Type = x.Type,
                    DateTime = x.DateTime,
                    Id = x.Id,
                    Total = x.Total,
                    ReceiptDetails = x.ReceiptDetails.Select(x => new DtoRequestIvaCompraDetails
                    {
                        ProductPrice = x.Price,
                        Quantity = x.Quantity,
                        Iva = x.Iva,
                        Iva10 = (x.Iva == (decimal)10.5) ? (((x.Price * x.Iva) / 100) * x.Quantity) : 0,
                        Iva21 = (x.Iva == 21) ? (((x.Price * x.Iva) / 100) * x.Quantity) : 0,
                        Iva27 = (x.Iva == 27) ? (((x.Price * x.Iva) / 100) * x.Quantity) : 0,
                    }).ToList(),

                }).ToList(),


            });
        }
    }
}
