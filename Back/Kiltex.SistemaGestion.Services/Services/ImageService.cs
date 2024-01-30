

using AutoMapper;
using Kiltex.SistemaGestion.Domain;
using Kiltex.SistemaGestion.SDK;
using Kiltex.SistemaGestion.SDK.Cloud.Storage.Client;
using Kiltex.SistemaGestion.SDK.Error;
using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Configuration.Images;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Kiltex.SistemaGestion.Services.Services
{
    public class ImageService : BaseService
    { 

        private readonly IConfiguration _configuration;

    private readonly IWebHostEnvironment _webHost;

    private readonly ConfigImageSite _configImages;

    private readonly GCStorageClient _googleStorage;
    /// <summary>
    /// Constructor
    /// </summary>
    /// <param name="logger"></param>
    /// <param name="context"></param>
    /// <param name="contextElastic"></param>
    /// <param name="cacheManager"></param>
    /// <param name="fullTextQueries"></param>
    public ImageService(
        GCStorageClient googleStorage,
        ConfigImageSite configImages,
        ErrorManager logger,
        DBContext context,
        //KTOperationsManager queryManager,
        //CacheManager cacheManager,
        //IndexNames indexNames,
        IConfiguration configuration,
        IWebHostEnvironment webHost,
    IMapper mapper) :
        base(logger, context, /*queryManager, cacheManager, indexNames,*/ mapper, configuration)
    {
        _googleStorage = googleStorage;
        _configImages = configImages;
        _configuration = configuration;
        _webHost = webHost;
    }
    public string TempPath { get => $"{Path.Combine(_webHost.ContentRootPath, "Images", _webHost.EnvironmentName)}{_configuration.GetValue<string>("ImagesConfig:Temp")}"; }
    public string DirectoryPath { get => $"{Path.Combine(_webHost.ContentRootPath, "Images", _webHost.EnvironmentName)}{_configuration.GetValue<string>("ImagesConfig:Directory")}"; }
    public string DirectoryGoogleCloud { get => $"{_configuration.GetValue<string>("ImagesConfig:Directory")}"; }

    /// <summary>
    /// Guarda una imagen en el disco
    /// </summary>
    /// <param name="image"></param>
    /// <param name="path"></param>
    /// <returns></returns>
    public async Task<(string uid, string imageName)> AddTempImage(IFormFile image, string path = null)
    {
        if (String.IsNullOrEmpty(path))
        {
            path = TempPath;
        }

        (string uid, string imageName) result = (Guid.NewGuid().ToString().Replace("-", ""), "");

        var filePath = Path.Combine(path, $"{result.uid}{Path.GetExtension(image.FileName)}");
        result.imageName = $"{result.uid}{Path.GetExtension(image.FileName)}";

        if (!Directory.Exists(path))
        {
            Directory.CreateDirectory(path);
        }

        while (File.Exists(filePath))
        {
            result.uid = Guid.NewGuid().ToString().Replace("-", "");
            result.imageName = $"{result.uid}.{ Path.GetExtension(image.FileName)}";
            filePath = $"{path}/{result.imageName}";
        }

        using Stream fileStream = new FileStream(filePath, FileMode.Create);
        await image.CopyToAsync(fileStream).ConfigureAwait(false);

        return result;
    }

    public List<string> CopyImagesToDirectoryFromTemp(
        List<RequestAddImage> imagesInTemp,
        string subDir,
        string standardName,
        string path = null,
        string pathTemp = null,
        bool generateSize = false)
    {
        if (String.IsNullOrEmpty(pathTemp))
        {
            pathTemp = TempPath;
        }

        if (String.IsNullOrEmpty(path))
        {
            path = DirectoryPath;
        }

        if (standardName.Length > 30)
        {
            standardName = standardName[..30];
        }

        var imagesResult = new List<string>();

        imagesInTemp.ForEach(img =>
        {
            if (img.IsNew)
            {
                var tmpPathFile = Path.Combine(pathTemp, img.Name);

                if (File.Exists(tmpPathFile))
                {

                    var pathResult = Path.Combine(path, subDir ?? "");

                    if (!Directory.Exists(pathResult))
                    {
                        Directory.CreateDirectory(pathResult);
                    }

                    var name = $"{DateTime.Now.Ticks}_{(standardName ?? "p")}{Path.GetExtension(img.Name)}";

                    imagesResult.Add($"{ subDir ?? ""}/{name}".Replace("\\", "/"));

                    ImagesTool.ResizeImage(_configImages.Large[0], tmpPathFile, Path.Combine(pathResult, name));

                    ImagesTool.ChangeQuality(tmpPathFile, Path.Combine(pathResult, name), _configImages.Compress);

                    #region Small TODO: Ver de crear una utilitaria para hacer esto

                    if (generateSize)
                    {
                        if (!Directory.Exists(Path.Combine(pathResult, "small")))
                        {
                            Directory.CreateDirectory(Path.Combine(pathResult, "small"));
                        }

                        ImagesTool.ResizeImage(_configImages.Small[0], tmpPathFile, Path.Combine(pathResult, "small", name));

                    }
                    #endregion
                }
            }
            else
            {
                imagesResult.Add($"{ subDir ?? ""}/{img.Name}".Replace("\\", "/"));
            }
        });
        return imagesResult;
    }

    public string CopyImageToDirectoryFromTemp(RequestAddImage img, string subDir, string standardName, string path = null, string pathTemp = null)
    {
        if (String.IsNullOrEmpty(pathTemp))
        {
            pathTemp = TempPath;
        }

        if (String.IsNullOrEmpty(path))
        {
            path = DirectoryPath;
        }

        if (img.IsNew)
        {
            var tmpPathFile = Path.Combine(pathTemp, img.Name);

            if (File.Exists(tmpPathFile))
            {
                var pathResult = Path.Combine(path, subDir ?? "");

                if (!Directory.Exists(pathResult))
                {
                    Directory.CreateDirectory(pathResult);
                }

                var name = $"{DateTime.Now.Ticks}_{(standardName ?? "p")}{Path.GetExtension(img.Name)}";

                File.Copy($"{pathTemp}{img.Name}", $"{path}{subDir ?? ""}{name}");

                return $"{ subDir ?? ""}{name}".Replace("\\", "/");
            }

            throw new FileNotFoundException("No existe la imagen en el temporal");
        }
        else
        {
            return $"{ subDir ?? ""}{img.Name}".Replace("\\", "/");
        }
    }

    public async Task<(MemoryStream file, string name)> GetImageNameFileBadges(string key)
    {
        //try
        //{
        //    var result = await _contextSql.Badge.Where(b => !b.IsDeleted && b.Key == key && b.Since <= DateTime.Now && b.Until >= DateTime.Now)
        //        .OrderByDescending(p => p.Priority)
        //        .ToListAsync();

        //    var budge = result.FirstOrDefault();

        //    if (budge != null)
        //    {
        //        return (_googleStorage.DownloadFile($"media/images/catalog/{budge.ImageUrl}"), budge.ImageUrl);
        //    }

        //    return (null, null);
        //}
        //catch (Exception e)
        //{
        //    _logger.LogError("image-error", key, e);
            return (null, null);
        //}
    }

    #region Google Storage
    /// <summary>
    /// Guarda una imagen en el disco
    /// </summary>
    /// <param name="image"></param>
    /// <param name="path"></param>
    /// <returns></returns>
    public async Task<(string uid, string imageName)> AddTempImageGoogleStorage(IFormFile image)
    {
        var path = "temp/";

        (string uid, string imageName) result = (Guid.NewGuid().ToString().Replace("-", ""), "");

        var filePath = $"{path}{result.uid}{Path.GetExtension(image.FileName)}";

        result.imageName = $"{result.uid}{Path.GetExtension(image.FileName)}";

        //await _googleStorage.UploadFileAsync(image, filePath, obj: obj);

        return result;
    }

    /// <summary>
    /// Guarda una imagen en el disco
    /// </summary>
    /// <param name="image"></param>
    /// <param name="path"></param>
    /// <returns></returns>
    public async Task<(string uid, string imageName)> AddTempImageGoogleStorage(Stream image, string name)
    {
        var path = "temp/";

        (string uid, string imageName) result = (Guid.NewGuid().ToString().Replace("-", ""), "");

        var filePath = $"{path}{result.uid}{Path.GetExtension(name)}";

        result.imageName = $"{result.uid}{Path.GetExtension(name)}";

        await _googleStorage.UploadFileAsync(image, filePath);

        return result;
    }

    /// <summary>
    /// Genera imagenes en Google Cloud
    /// </summary>
    /// <param name="imagesInTemp"></param>
    /// <param name="subDir"></param>
    /// <param name="standardName"></param>
    /// <param name="generateSize"></param>
    /// <returns></returns>
    public List<string> CopyImagesToDirectoryFromTempGoogleStorage(
                        List<RequestAddImage> imagesInTemp,
                        string subDir,
                        string standardName,
                        bool generateSize = false)
    {
        if (standardName.Length > 30)
        {
            standardName = standardName[..30];
        }

        var imagesResult = new List<string>();

        imagesInTemp.ForEach(img =>
        {
            if (img.IsNew)
            {
                var tmpPathFile = $"temp/{img.Name}";

                var name = $"{DateTime.Now.Ticks}_{(standardName ?? "p")}{Path.GetExtension(img.Name)}";

                imagesResult.Add($"{ subDir ?? ""}/{name}".Replace("\\", "/"));

                using var streamFile = _googleStorage.DownloadFile(tmpPathFile);

                ImagesTool.ResizeImage(_configImages.Large[0], streamFile, name);
                ImagesTool.ChangeQuality(streamFile, name, _configImages.Compress);

                _googleStorage.UploadFile(streamFile, $"{DirectoryGoogleCloud}{subDir}/{name}");

                #region Small TODO: Ver de crear una utilitaria para hacer esto

                if (generateSize)
                {
                    ImagesTool.ResizeImage(_configImages.Small[0], streamFile, name);
                    _googleStorage.UploadFile(streamFile, $"{DirectoryGoogleCloud}{subDir}/small/{name}");

                }
                #endregion

            }
            else
            {
                imagesResult.Add($"{ subDir ?? ""}/{img.Name}".Replace("\\", "/"));
            }
        });
        return imagesResult;
    }

    public string CopyImagesToDirectoryFromTempGoogleStorage(
                 RequestAddImage img,
                 string subDir,
                 string standardName,
                 bool generateSize = false,
                 bool changeQuality = false)
    {
        if (standardName.Length > 30)
        {
            standardName = standardName.Substring(0, 30);
        }

        string imagesResult;

        if (img.IsNew)
        {
            var tmpPathFile = $"temp/{img.Name}";

            var name = $"{DateTime.Now.Ticks}_{(standardName ?? "p")}{Path.GetExtension(img.Name)}";

            imagesResult = $"{ subDir ?? ""}/{name}".Replace("\\", "/");

            using var streamFile = _googleStorage.DownloadFile(tmpPathFile);
            if (changeQuality)
            {
                ImagesTool.ResizeImage(_configImages.Large[0], streamFile, name);
                ImagesTool.ChangeQuality(streamFile, name, _configImages.Compress);
            }
            _googleStorage.UploadFile(streamFile, $"{DirectoryGoogleCloud}{subDir}/{name}");

            #region Small TODO: Ver de crear una utilitaria para hacer esto

            if (generateSize)
            {
                ImagesTool.ResizeImage(_configImages.Small[0], streamFile, name);
                _googleStorage.UploadFile(streamFile, $"{DirectoryGoogleCloud}{subDir}/small/{name}");

            }
            #endregion

        }
        else
        {
            imagesResult = $"{ subDir ?? ""}/{img.Name}".Replace("\\", "/");
        }

        return imagesResult;
    }


    /// Genera imagenes en Google Cloud
    /// </summary>
    /// <param name="imagesInTemp"></param>
    /// <param name="subDir"></param>
    /// <param name="standardName"></param>
    /// <param name="generateSize"></param>
    /// <returns></returns>
    public List<string> CopyImagesToDirectoryFromTempLocalGoogleStorage(
                        List<RequestAddImage> imagesInTemp,
                        string subDir,
                        string standardName,
                        bool generateSize = false)
    {
        if (standardName.Length > 30)
        {
            standardName = standardName[..30];
        }

        var imagesResult = new List<string>();

        imagesInTemp.ForEach(img =>
        {
            if (img.IsNew)
            {
                var tmpPathFile = TempPath;

                var name = $"{DateTime.Now.Ticks}_{(standardName ?? "p")}{Path.GetExtension(img.Name)}";

                imagesResult.Add($"{ subDir ?? ""}/{name}".Replace("\\", "/"));

                using var streamFile = new MemoryStream();
                var content = File.ReadAllBytes(tmpPathFile + img.Name);
                streamFile.Write(content, 0, content.Length);

                ImagesTool.ResizeImage(_configImages.Large[0], streamFile, name);
                ImagesTool.ChangeQuality(streamFile, name, _configImages.Compress);

                _googleStorage.UploadFile(streamFile, $"{DirectoryGoogleCloud}{subDir}/{name}");

                #region Small TODO: Ver de crear una utilitaria para hacer esto

                if (generateSize)
                {
                    ImagesTool.ResizeImage(_configImages.Small[0], streamFile, name);
                    _googleStorage.UploadFile(streamFile, $"{DirectoryGoogleCloud}{subDir}/small/{name}");

                }
                #endregion

            }
            else
            {
                imagesResult.Add($"{ subDir ?? ""}/{img.Name}".Replace("\\", "/"));
            }
        });
        return imagesResult;
    }
    #endregion
}
}
