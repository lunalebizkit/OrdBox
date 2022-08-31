using Google.Apis.Auth.OAuth2;
using Google.Cloud.Storage.V1;
using Microsoft.AspNetCore.Http;
using System.Text;
using objetoData= Google.Apis.Storage.v1.Data.Object ;
namespace Kiltex.SistemaGestion.SDK.Cloud.Storage.Client
{

    public class GCStorageClient
    {
        private readonly StorageClient _storageClient;
        private readonly GoogleCredential _googleCredential;
        public readonly string _bucketName = string.Empty;
        public readonly string _bucketBasePath = string.Empty;

        public GCStorageClient(string credentialsFile, string bucketName, string basePath)
        {
            _googleCredential = GoogleCredential.FromFile(credentialsFile);
            _storageClient = StorageClient.Create(_googleCredential);
            _bucketName = bucketName;
            _bucketBasePath = basePath;
        }

        public async Task<objetoData> UploadFileAsync(IFormFile imageFile, string fileNameForStorage)
        {
            var obj =new objetoData
            { Name = $"{_bucketBasePath}{fileNameForStorage}",
             Bucket = _bucketName,};

            using var memoryStream = new MemoryStream();
            await imageFile.CopyToAsync(memoryStream);
            var dataObject = await _storageClient.UploadObjectAsync(obj, memoryStream);
            return dataObject;
        }

        public async Task<objetoData> UploadFileAsync(Stream imageFile, string fileNameForStorage)
        {
            var obj = new objetoData()
            {
                Name = $"{_bucketBasePath}{fileNameForStorage}",
                Bucket = _bucketName,
            };

            var dataObject = await _storageClient.UploadObjectAsync(obj, imageFile);
            return dataObject;
        }

        public objetoData UploadFile(Stream imageFile, string fileNameForStorage)
        {
            var obj = new objetoData()
            {
                Name = $"{_bucketBasePath}{fileNameForStorage}",
                Bucket = _bucketName,
            };
            var dataObject = _storageClient.UploadObject(obj, imageFile);
            return dataObject;
        }

        public async Task<objetoData> CrateFolder(string folderName)
        {
            if (!folderName.EndsWith("/"))
                folderName += "/";

            var content = Encoding.UTF8.GetBytes("");
            return await _storageClient.UploadObjectAsync(_bucketName, $"{_bucketBasePath}{folderName}", "application/x-directory", new MemoryStream(content));
        }

        public MemoryStream DownloadFile(string fileName)
        {
            var stream = new MemoryStream();
            var obj = new objetoData()
            {
                Name = $"{_bucketBasePath}{fileName}",
                Bucket = _bucketName,
            };

            _storageClient.DownloadObject(obj, stream);
            return stream;
        }
    }
}
