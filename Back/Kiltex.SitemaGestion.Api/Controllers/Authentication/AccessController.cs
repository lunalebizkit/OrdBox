using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.SDK.Security;
using Kiltex.SistemaGestion.Services.Services;
using Kiltex.SistemaGestion.Api.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Newtonsoft.Json;

namespace Kiltex.SistemaGestion.Api.Controllers.Authentication
{
    public class AccessController : ApiBaseController
    {
        [HttpPost]
        [Route("[action]")]
        [AllowAnonymous]
        public async Task<IActionResult> Auth([FromBody] LoginModel model,
            [FromServices] UserService service,
            [FromServices] IConfiguration configuration)
        {
            var usuario = await service.GetUserLogin(model.UserName, model.Password);
            if (!usuario.Success)
            {
                return Forbid();
                 
            }
            var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, usuario.Data.FirstName),
                    new Claim(ClaimTypes.Role, usuario.Data.Rol.Key),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                };
            

            authClaims.Add(new Claim(ClaimTypes.Role,  JsonConvert.SerializeObject(usuario.Data.Rol.PermissionXRols.Select(a => a.PermissionId).ToArray())));

            var token = JWTService.CreateDefaultToken(
                configuration["Jwt:Issuer"],
                configuration["Jwt:Audience"],
                   120,
                configuration["Jwt:SecretKey"],
                authClaims);
            return Ok(new
            {
                userName = usuario.Data.UserName,
                firstName = usuario.Data.FirstName,
                permisos = JsonConvert.SerializeObject(usuario.Data.Rol.PermissionXRols.Select(a => a.PermissionId).ToArray()),
                token = new JwtSecurityTokenHandler().WriteToken(token),
                expiration = token.ValidTo
            });
        }
    }
}
