using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kiltex.SistemaGestion.Domain.Model
{
    [Table("debit_memo")]
    public class DebitMemo : BaseModel
    {
        [Column("receipt_id")]
        public long ReceiptId { get; set; }

        [ForeignKey(nameof(ReceiptId))]
        public Receipt Receipt { get; set; }

        [Column("dateTime")]
        public DateTime DateTime { get; set; }
        [Required]
        [Column("supplier_id")]
        public long SupplierId { get; set; }
        
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

        [Column("supplier_address")]
        public string? SupplierAddress { get; set; }

        [Column("observation")]
        public string? Observation { get; set; }

        [Column("total")]
        public decimal? Total { get; set; }

        [Column("iva_total")]
        public decimal IvaTotal { get; set; }

        [Column("conc_no_gravado")]
        public decimal ConcNoGravado { get; set; }

        [Column("perc_iva")]
        public decimal PercIva { get; set; }

        [Column("perc_ing_brutos")]
        public decimal PercIngBrutos { get; set; }

        [Column("type")]
        public int Type { get; set; }

        public ICollection<DebitMemoDetails> DebitMemoDetails { get; set; } = new HashSet<DebitMemoDetails>();
    }
   
       
}
