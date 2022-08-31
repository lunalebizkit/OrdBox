using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Linq;
using System.Security.Claims;

namespace Kiltex.SistemaGestion.Api.Filter
{
    public class AllowAccessAttribute : ActionFilterAttribute
    {
        public string[] Rols { get; set; }

        public override void OnActionExecuting(ActionExecutingContext actionContext)
        {
            var isLogin = actionContext.HttpContext.User.Identity.IsAuthenticated;

            if (!isLogin)
            {
                actionContext.Result = new ContentResult { Content = "403", StatusCode = 401 };
            }
            else
            {
                if (!HasPermission(actionContext.HttpContext.User.Claims.First(p=> p.Type == ClaimTypes.Role)))
                {
                    actionContext.Result = new ContentResult { Content = "403", StatusCode = 401 };
                }
            }

            base.OnActionExecuting(actionContext);
        }

        private bool HasPermission(Claim claim)
        {
            if (claim == null)
                return false;

            return Rols.Any(r => r == claim.Value);
        }
    }
}