

using Kiltex.SistemaGestion.Services.Common;

namespace Kiltex.SistemaGestion.Services.Models.Dtos
{
    public class DtoAddProduct
    {
        public long Id { get; set; }

        public string Description { get; set; }

        public int? Code { get; set; }

        public long Category { get; set; }

       public long Brand { get; set; }

        public int Quantity { get; set; }

        public decimal PurchasePrice { get; set; }

        public decimal SalePrice { get; set; }

        public int SalePercentage { get; set; }

        public decimal CardSalePrice { get; set; }

        public int CardSalePercentage { get; set; }

        public decimal CashSalePrice { get; set; }

        public int CashSalePercentage { get; set; }

        public int PointOrder { get; set; }

        public string Observation { get; set; }

        public long Supplier { get; set; }

        public bool IsDeleted { get; set; }
    }
}
