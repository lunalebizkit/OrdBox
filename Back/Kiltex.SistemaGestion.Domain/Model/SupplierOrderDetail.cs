using Kiltex.SistemaGestion.Domain.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kiltex.SistemaGestion.Domain.Model
{
    [Table("supplier_order_detail")]
    public class SupplierOrderDetail : BaseModel
    {
        [Required]
        [Column("product_id")]
        public long ProductId { get; set; }

        [ForeignKey("ProductId")]
        public Product Product { get; set; }

        [Column("supplier_order_id")]
        public long SupplierOrderId { get; set; }

        [ForeignKey("SupplierOrderId")]
        public SupplierOrder SupplierOrder { get; set; }

        [Required]
        [Column("ordered_quantity")]
        public int OrderedQuantity { get; set; }
        [Required]
        [Column("recieved_quantity")]
        public int RecievedQuantity { get; set; }
        [Required]
        [Column("status_id")]
        public long StatusId { get; set; }

        [NotMapped]
        public ESupplierOrderStatuses Status { get => (ESupplierOrderStatuses)StatusId; }
    }
}
