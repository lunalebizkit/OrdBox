using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kiltex.SistemaGestion.Domain.Model
{
    [Table("budget")]
    internal class Budget : BaseModel
    {
        [Column("user_id")]
        public long UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public User User { get; set; }

        [Column("budget_number")]
        public long BudgetNumber { get; set; }

        [Column("customer_name")]
        public string? CustomerName { get; set; }

        [Column("customer_cuit")]
        public string? CustomerCuit { get; set; }

        [Column("customer_address")]
        public string? CustomerAddress { get; set; }

        [Column("observation")]
        public string? Observation { get; set; }

        [Required]
        [Column("dateTime")]
        public DateTime DateTime { get; set; }

        [Column("total")]
        public decimal Total { get; set; }

        [Column("iva_total")]
        public decimal IvaTotal { get; set; }

        [Column("type")]
        public int Type { get; set; }
    }
}
