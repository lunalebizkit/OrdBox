using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kiltex.SistemaGestion.Domain.Enum
{
    public class EPriceProduct
    {
        public const string PurchasePrice = "PurchasePrice";
        public const string Percentage = "Percentage";
        public const string CashSalePercentage = "CashSalePercentage";
        public const string CardSalePercentage = "CardSalePercentage";
        public const string SalePercentage = "SalePercentage";
    }

    public enum ePriceProduct
    {
        PurchasePrice = 1, //Se suma solo al costo y se calcula todo
        Percentage = 2, // Se suma el porcentaje al costo y se calcula todo
        CashSalePercentage = 3, //Solo se actualiza el porcentaje al precio contado
        CardSalePercentage = 4, //solo se actualiza el porcentake de tarjeta
        SalePercentage = 5, // se actualiza el porcentaje el precio de venta (lista)
    }
}
