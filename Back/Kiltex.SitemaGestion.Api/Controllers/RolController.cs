using Kiltex.SistemaGestion.Services.Dtos;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Services;
using Microsoft.AspNetCore.Mvc;

namespace Kiltex.SistemaGestion.Api.Controllers
{
    public class RolController : ApiBaseController
    {
        private readonly RolService _service;

        public RolController(RolService service)
        {
            _service = service;
        }
        
        //public async Task<IActionResult> New([FromBody] RequestAddPermission model)
        //{
        //    return Return(await _service.AddPermission(model).ConfigureAwait(false));
        //}
        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> New([FromBody] RequestAddRol model)
        {
            return Return(await _service.Add(model).ConfigureAwait(false));
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        //[AllowAccess(Rols = new string[] { ERol.Admin })]
        public async Task<IActionResult> Get([FromQuery] long id)
        {
            return Return(await _service.GetById(id).ConfigureAwait(false));
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut]
        //[AllowAccess(Rols = new string[] { ERol.Admin })]
        public async Task<IActionResult> Edit([FromBody] RequestAddRol model)
        {
            return Return(await _service.Update(model).ConfigureAwait(false));
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("[action]")]
        //[AllowAccess(Rols = new string[] { ERol.Admin })]
        public async Task<IActionResult> ListPermissions()
        {
            return Return(await _service.ListPermissions().ConfigureAwait(false));
        }


        [HttpPost]
        [Route("action")]
        public async Task<IActionResult> AddOrUpdatePermission([FromBody] DtoRequestAddPermissionXRol model)
        {
            return Return(await _service.AddOrUpdatePermission(model).ConfigureAwait(false));
        }
    }
}
