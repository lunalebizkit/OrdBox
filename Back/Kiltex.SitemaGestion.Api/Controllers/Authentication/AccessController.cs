
using Kiltex.SistemaGestion.Services.Services;
using Kiltex.SistemaGestion.Api.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Newtonsoft.Json;
using Kiltex.SistemaGestion.SDK.Jwt;
using Kiltex.SistemaGestion.Api.Extension;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Kiltex.SistemaGestion.Domain.Model;
using Usuario = Kiltex.SistemaGestion.Domain.Model.User;
using Kiltex.SistemaGestion.Services.Common;

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

            var permission = usuario.Data.Rol.PermissionXRols.Select(y => y.Permission.EnumPermission).ToArray();
                        
            var token = JWTService.CreateDefaultToken(
                configuration["Jwt:Issuer"],
                configuration["Jwt:Audience"],
                360,
                configuration["Jwt:SecretKey"],
                GenerateClaims(usuario));

            return Ok(new
            {
                id = usuario.Data.Id,
                userName = usuario.Data.UserName,
                firstName = usuario.Data.FirstName,
                rol = usuario.Data.Rol.Key,
                permission,
                token = new JwtSecurityTokenHandler().WriteToken(token),
            expiration = token.ValidTo
            });

        }
        private static ClaimsIdentity GenerateClaims(OperationResponse<Usuario> usuario)
        {
            var claims = new ClaimsIdentity();
            claims.AddClaim(new Claim(ClaimTypes.Name, usuario.Data.FirstName));
            claims.AddClaim(new Claim(ClaimTypes.Role, usuario.Data.Rol.Key));
            var permission = usuario.Data.Rol.PermissionXRols.Select(y => y.Permission.EnumPermission).ToArray();
            claims.AddClaim(new Claim(UserExtension.claimPermission,  JsonConvert.SerializeObject(permission)));


            return claims;
        }
    }
}
