
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Kiltex.SistemaGestion.Domain.Model
{
    
        public class BaseModel
        {
            [Key]
            [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
            [Column("id")]
            public long Id { get; set; }
        }
    
}
