using Kiltex.SistemaGestion.Services.Services;
using Kiltex.SitemaGestion.Api.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kiltex.SistemaGestion.Api.Controllers.Image
{
    public class ImageController : ApiBaseController
    {
        /// <summary>
        /// Sube una image por medio de form-data
        /// </summary>
        /// <param name="service"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("[action]")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0037:Use inferred member name", Justification = "<Pending>")]
        public async Task<IActionResult> Upload(
            [FromServices] ImageService service)
        {
            if (Request.Form != null && Request.Form.Files.Count == 1)
            {
                var (uid, imageName) = await service.AddTempImageGoogleStorage(Request.Form.Files[0]).ConfigureAwait(false);
                //await service.AddTempImage(Request.Form.Files[0]).ConfigureAwait(false);

                return Ok(new { uid = uid, image = imageName });

            }
            return NotFound();
        }

        [HttpGet]
        [Route("/images/badge/{key}")]
        [AllowAnonymous]
        [ResponseCache(VaryByHeader = "User-Agent", Duration = 60, Location = ResponseCacheLocation.Any, NoStore = false)]
        public async Task<IActionResult> Get(string key, [FromServices] ImageService service)
        {
            var (file, name) = await service.GetImageNameFileBadges(key);
            try
            {
                if (file == null)
                    return NotFound();

                var ext = new FileInfo(name).Extension.Replace(".", "");
                return File(file.ToArray(), $"image/{ext}");
            }
            finally
            {
                if (file != null)
                    file.Dispose();
            }
        }
    }
}
