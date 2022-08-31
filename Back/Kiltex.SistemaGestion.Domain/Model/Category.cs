
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Kiltex.SistemaGestion.Domain.Model
{
    [Table("category")]
    public class Category : BaseModel
    {
        [Required]
        [Column("description")]
        public string? Description { get; set; }

    }
}
