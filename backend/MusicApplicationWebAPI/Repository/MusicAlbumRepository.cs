using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Minio;
using MusicApplicationWebAPI.Data;
using MusicApplicationWebAPI.Dtos;
using MusicApplicationWebAPI.Dtos.MusicAlbum;
using MusicApplicationWebAPI.Dtos.MusicArtist;
using MusicApplicationWebAPI.Interfaces;
using MusicApplicationWebAPI.Models.Entities;

namespace MusicApplicationWebAPI.Repository
{
    public class MusicAlbumRepository : IMusicAlbumRepository
    {
        private readonly AppDbContext _context;
        private readonly string minioBaseUrl;
        private readonly string minioAccessKey;
        private readonly string minioSecretKey;
        private readonly MinioClient _minioClient;
        public MusicAlbumRepository(AppDbContext dbContext)
        {
            DotNetEnv.Env.Load();
            minioBaseUrl = Environment.GetEnvironmentVariable("MINIO_BASE_URL") ?? "";
            minioAccessKey = Environment.GetEnvironmentVariable("MINIO_ACCESS_KEY") ?? "";
            minioSecretKey = Environment.GetEnvironmentVariable("MINIO_SECRET_KEY") ?? "";

            _context = dbContext;

            _minioClient = new MinioClient()
                .WithEndpoint(new Uri(minioBaseUrl).Host, 9002)
                .WithCredentials(minioAccessKey, minioSecretKey)
                .WithSSL(minioBaseUrl.StartsWith("https"))
                .Build();
        }

        public async Task<MusicAlbum> AddMusicAlbum(AddMusicAlbumDto musicAlbumDto)
        {
            var musicAlbum = new MusicAlbum
            {
                Title = musicAlbumDto.Title,
                CoverURL = "",
                UploadedAt = DateTime.UtcNow,
                ReleaseDate = DateTime.SpecifyKind(musicAlbumDto.ReleaseDate, DateTimeKind.Utc)
            };

            await _context.MusicAlbum.AddAsync(musicAlbum);
            await _context.SaveChangesAsync();

            if (musicAlbumDto.CoverImage != null && musicAlbumDto.CoverImage.Length > 0)
            {
                string bucketName = "music-application";
                string objectName = $"cover/album/{musicAlbum.Id}/{musicAlbum.Id}.jpg";

                var bucketExistsArgs = new BucketExistsArgs().WithBucket(bucketName);
                bool exists = await _minioClient.BucketExistsAsync(bucketExistsArgs);
                if (!exists)
                {
                    var makeBucketArgs = new MakeBucketArgs().WithBucket(bucketName);
                    await _minioClient.MakeBucketAsync(makeBucketArgs);
                }

                using var stream = musicAlbumDto.CoverImage.OpenReadStream();

                var putObjectArgs = new PutObjectArgs()
                    .WithBucket(bucketName)
                    .WithObject(objectName)
                    .WithStreamData(stream)
                    .WithObjectSize(musicAlbumDto.CoverImage.Length)
                    .WithContentType(musicAlbumDto.CoverImage.ContentType);

                await _minioClient.PutObjectAsync(putObjectArgs);

                musicAlbum.CoverURL = $"{minioBaseUrl}/music-application/{objectName}";
                _context.MusicAlbum.Update(musicAlbum);
                await _context.SaveChangesAsync();
            }

            musicAlbum.CoverURL = $"{minioBaseUrl}/music-application/cover/album/{musicAlbum.Id}/{musicAlbum.Id}.jpg";
            _context.MusicAlbum.Update(musicAlbum);
            await _context.SaveChangesAsync();

            return musicAlbum;
        }

        public async Task<MusicAlbum?> DeleteMusicAlbum(Guid id)
        {
            var musicAlbum = await _context.MusicAlbum.FindAsync(id);
            if (musicAlbum is null)
            {
                return null;
            }

            string bucketName = "music-application";
            string objectName = $"cover/album/{musicAlbum.Id}/{musicAlbum.Id}.jpg";

            try
            {
                var removeObjectArgs = new RemoveObjectArgs()
                    .WithBucket(bucketName)
                    .WithObject(objectName);

                await _minioClient.RemoveObjectAsync(removeObjectArgs);
                Console.WriteLine("Cover-Bild erfolgreich aus MinIO gelöscht.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Fehler beim Löschen des Cover-Bildes: {ex.Message}");
            }

            _context.MusicAlbum.Remove(musicAlbum);
            await _context.SaveChangesAsync();
            return musicAlbum;
        }

        public async Task<List<MusicAlbum>> GetAllMusicAlbums()
        {
            return await _context.MusicAlbum.ToListAsync();
        }

        public async Task<MusicAlbumDto?> GetMusicAlbumById(Guid id)
        {
            var musicAlbum = await _context.MusicAlbum
                .Include(album => album.MusicArtistAlbums)
                .ThenInclude(artist_album => artist_album.MusicArtist)
                .FirstOrDefaultAsync(album => album.Id == id);

            if (musicAlbum is null)
            {
                return null;
            }

            var musicAlbumDto = new MusicAlbumDto
            {
                Id = musicAlbum.Id,
                Title = musicAlbum.Title,
                CoverURL = musicAlbum.CoverURL,
                UploadedAt = musicAlbum.UploadedAt,
                ReleaseDate = musicAlbum.ReleaseDate,
                MusicArtists = musicAlbum.MusicArtistAlbums
                    .Select(musicArtist => new MusicArtistShortFormDto
                    {
                        Id = musicArtist.MusicArtist.Id,
                        Name = musicArtist.MusicArtist.Name
                    }).ToList()
            };

            return musicAlbumDto;
        }

        public async Task<MusicAlbum?> UpdateMusicAlbum(Guid id, UpdateMusicAlbumDto musicAlbumDto)
        {
            var musicAlbum = await _context.MusicAlbum.FindAsync(id);
            if (musicAlbum is null)
            {
                return null;
            }

            if (musicAlbumDto.CoverImage != null)
            {
                if (!string.IsNullOrEmpty(musicAlbum.CoverURL))
                {
                    var oldCoverPath = new Uri(musicAlbum.CoverURL).AbsolutePath;
                    var oldCoverFileName = Path.GetFileName(oldCoverPath);
                    var oldCoverObjectName = $"cover/album/{musicAlbum.Id}/{oldCoverFileName}";
                    try
                    {
                        var removeObjectArgs = new RemoveObjectArgs()
                            .WithBucket("music-application")
                            .WithObject(oldCoverObjectName);

                        await _minioClient.RemoveObjectAsync(removeObjectArgs);
                        Console.WriteLine("Altes Cover-Bild erfolgreich aus MinIO gelöscht.");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Fehler beim Löschen des alten Cover-Bildes: {ex.Message}");
                    }
                }

                string newCoverFileName = $"{musicAlbum.Id}.jpg";
                string newCoverURL = $"{minioBaseUrl}/music-application/cover/album/{musicAlbum.Id}/{newCoverFileName}";

                await UploadCoverImage(musicAlbumDto.CoverImage, musicAlbum.Id);

                musicAlbum.CoverURL = newCoverURL;
            }

            musicAlbum.Title = musicAlbumDto.Title;
            musicAlbum.ReleaseDate = DateTime.SpecifyKind(musicAlbumDto.ReleaseDate, DateTimeKind.Utc);

            await _context.SaveChangesAsync();
            return musicAlbum;
        }

        private async Task UploadCoverImage(IFormFile coverImage, Guid albumId)
        {
            var bucketName = "music-application";
            var objectName = $"cover/album/{albumId}/{albumId}.jpg";
            using var stream = coverImage.OpenReadStream();
            var putObjectArgs = new PutObjectArgs()
                .WithBucket(bucketName)
                .WithObject(objectName)
                .WithStreamData(stream)
                .WithObjectSize(coverImage.Length)
                .WithContentType("image/jpeg");

            await _minioClient.PutObjectAsync(putObjectArgs);
            Console.WriteLine("Neues Cover-Bild erfolgreich in MinIO hochgeladen.");
        }
    }
}