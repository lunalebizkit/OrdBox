using Newtonsoft.Json;
using System.Security.Claims;

namespace Kiltex.SistemaGestion.Api.Extension
{
    public static class UserExtension
    {
        public const string claimPermission = "Permisos";

        public static int[] GetPermission(this ClaimsPrincipal user)
        {
            var claims = user.Claims.FirstOrDefault(p => p.Type == claimPermission);

            if (claims != default)
            {
                var permission = JsonConvert.DeserializeObject<int[]>(claims.Value);

                if (permission != null)
                {
                    return permission;
                }
            }
            return Array.Empty<int>();
        }
    }
}
