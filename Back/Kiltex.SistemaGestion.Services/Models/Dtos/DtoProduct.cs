
using Kiltex.SistemaGestion.Services.Common;

namespace Kiltex.SistemaGestion.Services.Models.Dtos
{
    public class DtoProduct
    {
        public long Id { get; set; }

        public string Description { get; set; }

        public int? Code { get; set; }

        public string CategoryName { get; set; }

        public string BrandName { get; set; }

        public int Quantity { get; set; }

        public decimal PurchasePrice { get; set; }

        public int SalePercentage { get; set; }

        public decimal SalePrice { get; set; }

        public int CardSalePercentage { get; set; }

        public decimal CardSalePrice { get; set; }
        
        public int CashSalePercentage { get; set; }
        
        public decimal CashSalePrice { get; set; }

        public int PointOrder { get; set; }

        public string Observation { get; set; }

        public string SupplierName    { get; set; }
    }
}
