using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Minio;

namespace MusicApplicationWebAPI.Services
{
    public class MinioFileService
    {

        private readonly MinioClient _minioClient;
        private const string BucketName = "music-application";
        private readonly string minioBaseUrl;
        private readonly string minioAccessKey;
        private readonly string minioSecretKey;

        public MinioFileService(MinioClient minioClient)
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

        public async Task<Stream?> GetImageStreamAsync(string bucketName, string objectName)
        {
            var stream = new MemoryStream();
            try
            {
                var getObjectArgs = new GetObjectArgs()
                    .WithBucket(bucketName)
                    .WithObject(objectName)
                    .WithCallbackStream(s => s.CopyTo(stream));

                await _minioClient.GetObjectAsync(getObjectArgs);
                stream.Seek(0, SeekOrigin.Begin);
                return stream;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[MinIO] Fehler beim Bildabruf: {ex.Message}");
                return null;
            }
        }

        public async Task<string> UploadAudioFileAsync(Guid trackId, IFormFile audioFile)
        {
            var extension = Path.GetExtension(audioFile.FileName);
            var objectName = $"audio/track/{trackId}/{trackId}{extension}";

            using var stream = audioFile.OpenReadStream();
            var putObjectArgs = new PutObjectArgs()
                .WithBucket(BucketName)
                .WithObject(objectName)
                .WithStreamData(stream)
                .WithObjectSize(audioFile.Length)
                .WithContentType(audioFile.ContentType);

            await _minioClient.PutObjectAsync(putObjectArgs);

            return $"{minioBaseUrl}/{BucketName}/{objectName}";
        }
    }
}