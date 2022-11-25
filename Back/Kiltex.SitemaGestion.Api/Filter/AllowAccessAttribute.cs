using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.Domain.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Linq;
using System.Security.Claims;

namespace Kiltex.SistemaGestion.Api.Filter
{
    public class AllowAccessAttribute : ActionFilterAttribute
    {
        public EPermission[] Permission { get; set; }

        public override void OnActionExecuting(ActionExecutingContext actionContext)
        {
            var isLogin = actionContext.HttpContext.User.Identity.IsAuthenticated;

            //if (!isLogin)
            //{
            //    actionContext.Result = new ContentResult { Content = "403", StatusCode = 401 };
            //}
            //else
            //{
            //    if (!HasPermission(actionContext.HttpContext.User.Claims.First(p=> p.Type == ClaimTypes.Role)))
            //    {
            //        actionContext.Result = new ContentResult { Content = "403", StatusCode = 401 };
            //    }
            //}

            base.OnActionExecuting(actionContext);
        }

        private bool HasPermission(int[] claim)
        {
            if (claim == null)
                return false;

            return Permission.Any(r => claim.Contains((int)r));
        }
    }
}