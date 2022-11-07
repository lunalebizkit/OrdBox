using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Dtos;
using Kiltex.SistemaGestion.Services.Services;
using Microsoft.AspNetCore.Mvc;

namespace Kiltex.SistemaGestion.Api.Controllers.User
{
    public class UserController : ApiBaseController
    {
        private readonly UserService _service;
        public UserController(UserService service)
        {
            _service = service;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        //[AllowAccess(Rols = new string[] { ERol.Admin })]
        public async Task<IActionResult> New([FromBody] RequestAddUser model)
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
        [HttpPut]
        //[AllowAccess(Rols = new string[] { ERol.Admin })]
        public async Task<IActionResult> Edit([FromBody] RequestAddUser model)
        {
            return Return(await _service.Update(model).ConfigureAwait(false));
        }
        [HttpDelete]
        //[AllowAccess(Rols = new string[] { ERol.Admin })]
        [Route("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            return Return(await _service.Delete(id).ConfigureAwait(false));
        }
        [HttpPost]
        [Route("[action]")]
        //[AllowAccess(Rols = new string[] { ERol.Admin })]
        public async Task<IActionResult> List([FromBody] RequestPaginatedData<string> filter)
        {
            return Return(await _service.ListUsers(filter).ConfigureAwait(false));
        }
    }
}
