using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Minio;

namespace MusicApplicationWebAPI.Services
{
    public class MinioImageService
    {

        private readonly MinioClient _minioClient;
        private const string BucketName = "music-application";
        private readonly string minioBaseUrl;
        private readonly string minioAccessKey;
        private readonly string minioSecretKey;

        public MinioImageService(MinioClient minioClient)
        {
            _minioClient = minioClient;
            DotNetEnv.Env.Load();
            minioBaseUrl = Environment.GetEnvironmentVariable("MINIO_BASE_URL") ?? "";
            minioAccessKey = Environment.GetEnvironmentVariable("MINIO_ACCESS_KEY") ?? "";
            minioSecretKey = Environment.GetEnvironmentVariable("MINIO_SECRET_KEY") ?? "";
        }

        public async Task<string> UploadAlbumCoverAsync(Guid albumId, IFormFile image)
        {
            var objectName = $"cover/album/{albumId}/{albumId}.jpg";

            using var stream = image.OpenReadStream();
            var putObjectArgs = new PutObjectArgs()
                .WithBucket(BucketName)
                .WithObject(objectName)
                .WithStreamData(stream)
                .WithObjectSize(image.Length)
                .WithContentType("image/jpeg");

            await _minioClient.PutObjectAsync(putObjectArgs);

            return $"{minioBaseUrl}/{BucketName}/{objectName}";
        }

        public async Task DeleteAlbumCoverAsync(Guid albumId)
        {
            var objectName = $"cover/album/{albumId}/{albumId}.jpg";

            var removeObjectArgs = new RemoveObjectArgs()
                .WithBucket(BucketName)
                .WithObject(objectName);

            await _minioClient.RemoveObjectAsync(removeObjectArgs);
        }
        public string GetAlbumCoverUrl(Guid albumId)
        {
            var objectName = $"cover/album/{albumId}/{albumId}.jpg";
            return $"{minioBaseUrl}/{BucketName}/{objectName}";
        }
    }
}