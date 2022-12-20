using AutoMapper;
using Kiltex.SistemaGestion.Domain;
using Kiltex.SistemaGestion.SDK.Error;
using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kiltex.SistemaGestion.Services.Services
{
    public class IvaService : BaseService
    {
        public IvaService(ErrorManager logger, DBContext context, IMapper maper) :
            base(logger, context, maper)
        { }

        public async Task<OperationResponse<DtoRequestIvaVenta>> ListIvaVenta(DateTime from, DateTime to, CancellationToken ct = default)
        {
            var query = _contextSql
                                    .InvoiceDetails
                                    .Include(p => p.Invoice)
                                    .Where(x => x.Invoice.DateTime >= from && x.Invoice.DateTime <= to)
                                    .AsNoTracking();
            var count = await query.CountAsync().ConfigureAwait(false);

            var list = await query.OrderBy(p => p.Invoice.DateTime)
                                  .ToListAsync()
                                  .ConfigureAwait(false);
            decimal total21 = 0;
            decimal total10 = 0;
            decimal total27 = 0;
            decimal totalAmount = 0;
            foreach (var item in list)
            {
                var porcentaje = (item.Iva * 100) / item.Price;
                switch (porcentaje)
                {
                    case 21:
                        total21 += item.Iva;
                        break;
                    case 27:
                        total27 += item.Iva;
                        break;
                    case (decimal)10.5:
                        total10 += item.Iva;
                        break;
                }
                totalAmount += item.Invoice.Total;
            }

            return new OperationResponse<DtoRequestIvaVenta>(new DtoRequestIvaVenta
            {
                InvoiceDetails = list.Select(x => new DtoRequestIvaVentaDetails
                {
                    CustomerCuit = x.Invoice.CustomerCuit,
                    CustomerName = x.Invoice.CustomerName,
                    InvoiceNumber = x.Invoice.InvoiceNumber,
                    Type = x.Invoice.Type,
                    DateTime = x.Invoice.DateTime,
                    Id = x.Invoice.Id,
                    Iva = x.Iva,
                    IvaType = differentiateIva(x.Price, x.Iva),
                    Total = x.Invoice.Total,
                }).ToList(),
                TotalIva10 = total10,
                TotalIva21 = total21,
                TotalIva27 = total27,
                PeriodTotal = totalAmount
            });

            ;
        }
        public async Task<OperationResponse<DtoRequestIvaCompra>> ListIvaCompra(DateTime from, DateTime to, CancellationToken ct = default)
        {
            var query = _contextSql
                                    .ReceiptDetails
                                    .Include(p => p.Receipt)
                                    .Where(x => x.Receipt.DateTime >= from && x.Receipt.DateTime <= to)
                                    .AsNoTracking();
            var count = await query.CountAsync().ConfigureAwait(false);

            var list = await query.OrderBy(p => p.Receipt.DateTime)
                                  .ToListAsync()
                                  .ConfigureAwait(false);
            decimal total21 = 0;
            decimal total10 = 0;
            decimal total27 = 0;
            decimal? totalAmount = 0;
            foreach (var item in list)
            {
                var porcentaje = (item.Iva * 100) / item.Price;
                switch (porcentaje)
                {
                    case 21:
                        total21 += item.Iva;
                        break;
                    case 27:
                        total27 += item.Iva;
                        break;
                    case (decimal)10.5:
                        total10 += item.Iva;
                        break;
                }
                totalAmount += item.Receipt.Total;
            }

            return new OperationResponse<DtoRequestIvaCompra>(new DtoRequestIvaCompra
            {
                ReceiptDetails = list.Select(x => new DtoRequestIvaCompraDetails
                {
                    SupplierName = x.Receipt.SupplierName,
                    ReceiptNumber = x.Receipt.ReceiptNumber,
                    SupplierCuit = x.Receipt.SupplierCuit,
                    SupplierAddress = x.Receipt.SupplierAdress,
                    Type = x.Receipt.Type,
                    DateTime = x.Receipt.DateTime,
                    Id = x.Receipt.Id,
                    Iva = x.Iva,
                    IvaType = differentiateIva(x.Price, x.Iva),
                    Total = x.Receipt.Total,
                }).ToList(),
                TotalIva10 = total10,
                TotalIva21 = total21,
                TotalIva27 = total27,
                PeriodTotal = totalAmount
            });

            ;
        }
        private string differentiateIva(decimal price, decimal iva)
        {
            switch ((iva * 100 )/price)
            {
                case 21:
                    return "21";
                    break;
                case 27:
                    return "27";
                    break;
                case (decimal)10.5:
                    return "10.5";
                    break;
            }
            return null;
        }
    }
}
