
using System.ComponentModel.DataAnnotations.Schema;


namespace Kiltex.SistemaGestion.Domain.Model
{
    [Table("receipt")]
    public class Receipt : BaseModel
    {
        [Column("supplier_id")]
        public long? SupplierId { get; set; }

        [ForeignKey(nameof(SupplierId))]
        public Supplier Supplier { get; set; }

        [Column("user_id")]
        public long UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public User User { get; set; }

        [Column("receipt_number")]
        public int ReceiptNumber { get; set; }

        [Column("supplier_name")]
        public string? SupplierName { get; set; }

        [Column("supplier_cuit")]
        public string? SupplierCuit { get; set; }

        [Column("supplier_adress")]
        public string? SupplierAdress { get; set; }

        [Column("observation")]
        public string? Observation { get; set; }

        [Column("dateTime")]
        public DateTime DateTime { get; set; }

        [Column("total")]
        public decimal? Total { get; set; }

        [Column("iva_total")]
        public decimal IvaTotal { get; set; }

        [Column("type")]
        public int Type { get; set; }

        public ICollection<ReceiptDetails> ReceiptDetails { get; set; } = new HashSet<ReceiptDetails>();

    }
}
