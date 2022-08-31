using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kiltex.SistemaGestion.Domain.Model
{
    [Table("supplier")]
    public class Supplier : Entity
    {
        [Column("observation")]
        public string? Observation { get; set; }
    }
}
