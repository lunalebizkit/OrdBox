

using System.ComponentModel.DataAnnotations;

namespace Kiltex.SistemaGestion.Services.Models.Dtos
{
    public class RequestAddPermissionXRol
    {
        public long Id { get; set; }

        public string Name { get; set; }

        public string Key { get; set; }

        public List<long> PermissionIds { get; set; }

    }
}
