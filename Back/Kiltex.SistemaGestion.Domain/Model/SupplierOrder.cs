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
    [Table("supplier_order")]
    public class SupplierOrder : BaseModel
    {
        [Required]
        [Column("supplier_id")]
        public long SupplierId { get; set; }

        [ForeignKey("SupplierId")]
        public Supplier Supplier { get; set; }

        [Column("is_paid")]
        public bool IsPaid { get; set; }

        [Required]
        [Column("status_id")]
        public long StatusId { get; set; }

        public ICollection<SupplierOrderDetail> SupplierOrderDetail { get; set; } = new HashSet<SupplierOrderDetail>();

        [NotMapped]
        public ESupplierOrderStatuses Status { get => (ESupplierOrderStatuses)StatusId; }


    }
}
