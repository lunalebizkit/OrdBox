using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Kiltex.SistemaGestion.SDK.Jwt
{
    public class JWTService
    {
        public static JwtSecurityToken CreateDefaultToken(string issuer, string audience, int minutesExpire, string key, List<Claim> claims)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var token = new JwtSecurityToken(
               issuer: issuer,
               audience: audience,
               expires: DateTime.Now.AddMinutes(minutesExpire),
               claims: claims,
               signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
               );

            return token;
        }
    }
}
