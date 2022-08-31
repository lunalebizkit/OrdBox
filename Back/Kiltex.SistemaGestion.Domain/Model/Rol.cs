
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Kiltex.SistemaGestion.Domain.Model
{
    [Table("rol")]
    public class Rol : BaseModel
    {
        [Required]
        [Column("name")]
        public string Name { get; set; }

        [Column("key")]
        public string Key { get; set; }

        public List<PermissionXRol> PermissionXRols { get; set; }

    }
}
