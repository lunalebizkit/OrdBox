using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Kiltex.SistemaGestion.SDK.Jwt
{
    public class JWTService
    {
        public static SecurityToken CreateDefaultToken(string issuer, string audience, int minutesExpire, string key, ClaimsIdentity claims)
        {
            var handler = new JwtSecurityTokenHandler();

            var encodedKey = Encoding.ASCII.GetBytes(key);

            var credentials = new SigningCredentials(
                new SymmetricSecurityKey(encodedKey),
                SecurityAlgorithms.HmacSha256Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = claims,
                Expires = DateTime.UtcNow.AddMinutes(360),
                SigningCredentials = credentials,
            };

            var token = handler.CreateToken(tokenDescriptor);

            return token;
        }
    }
}
