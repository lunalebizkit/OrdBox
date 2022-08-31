

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Kiltex.SistemaGestion.Domain.Model
{
    [Table("brand")]
    public class Brand : BaseModel
    {   
        [Required]
        [Column("description")]
        public string? Description { get; set; }

      
    }
}
