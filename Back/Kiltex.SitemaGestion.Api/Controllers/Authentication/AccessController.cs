
using Kiltex.SistemaGestion.Services.Services;
using Kiltex.SistemaGestion.Api.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Newtonsoft.Json;
using Kiltex.SistemaGestion.SDK.Jwt;
using Kiltex.SistemaGestion.Api.Extension;

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
            
            var permission = usuario.Data.Rol.PermissionXRols.Select(y => y.Permission.EnumPermission).ToArray();
            authClaims.Add(new Claim(UserExtension.claimPermission,  JsonConvert.SerializeObject(permission)));

            var token = JWTService.CreateDefaultToken(
                configuration["Jwt:Issuer"],
                configuration["Jwt:Audience"],
                   120,
                configuration["Jwt:SecretKey"],
                authClaims);
            return Ok(new
            {
                id = usuario.Data.Id,
                userName = usuario.Data.UserName,
                firstName = usuario.Data.FirstName,
                permission = permission,
                token = new JwtSecurityTokenHandler().WriteToken(token),
                expiration = token.ValidTo
            });
        }
    }
}
