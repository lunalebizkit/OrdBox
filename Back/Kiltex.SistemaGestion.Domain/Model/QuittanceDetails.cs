using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kiltex.SistemaGestion.Domain.Model
{
    [Table("quittance_details")]
    public class QuittanceDetails
    {
        [Column("check_number")]
        public string? CheckNumber { get; set; }

        [Column("total")]
        public string? Total { get; set; }

        [Column("bank")]
        public string? Bank { get; set; }
    }
}
