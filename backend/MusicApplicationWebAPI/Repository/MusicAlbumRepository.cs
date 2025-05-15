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
using MusicApplicationWebAPI.Services;

namespace MusicApplicationWebAPI.Repository
{
    public class MusicAlbumRepository : IMusicAlbumRepository
    {
        private readonly AppDbContext _context;
        private readonly MinioFileService _minioFileService;
        public MusicAlbumRepository(AppDbContext dbContext, MinioFileService minioFileService)
        {
            _minioFileService = minioFileService;
            _context = dbContext;
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

            if (musicAlbumDto.CoverImage != null)
            {
                var coverUrl = await _minioFileService.UploadMusicAlbumCoverAsync(musicAlbum.Id, musicAlbumDto.CoverImage);
                musicAlbum.CoverURL = coverUrl;
                _context.MusicAlbum.Update(musicAlbum);
                await _context.SaveChangesAsync();
            }
            return musicAlbum;
        }

        public async Task<MusicAlbum?> DeleteMusicAlbum(Guid id)
        {
            var musicAlbum = await _context.MusicAlbum.FindAsync(id);
            if (musicAlbum is null)
            {
                return null;
            }

            await _minioFileService.DeleteMusicAlbumCoverAsync(musicAlbum.Id);

            _context.MusicAlbum.Remove(musicAlbum);
            await _context.SaveChangesAsync();

            return musicAlbum;
        }

        public async Task<List<MusicAlbumDto>> GetAllMusicAlbums()
        {
            var musicAlbums = await _context.MusicAlbum
            .Include(music_album => music_album.MusicArtistAlbums)
            .ThenInclude(music_artist_album => music_artist_album.MusicArtist)
            .ToListAsync();

            return [.. musicAlbums.Select(music_album => new MusicAlbumDto
            {
                Id = music_album.Id,
                Title = music_album.Title,
                CoverURL = music_album.CoverURL,
                UploadedAt = music_album.UploadedAt,
                ReleaseDate = music_album.ReleaseDate,
                Description = music_album.Description,
                MusicArtists = [.. music_album.MusicArtistAlbums
                    .Select(music_artist_album => new MusicArtistShortFormDto
                    {
                        Id = music_artist_album.MusicArtist.Id,
                        Name = music_artist_album.MusicArtist.Name
                    })]
            })];
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
                Description = musicAlbum.Description,
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
                return null;

            if (musicAlbumDto.CoverImage != null)
            {
                await _minioFileService.DeleteMusicAlbumCoverAsync(musicAlbum.Id);
                var newCoverUrl = await _minioFileService.UploadMusicAlbumCoverAsync(musicAlbum.Id, musicAlbumDto.CoverImage);
                musicAlbum.CoverURL = newCoverUrl;
            }

            musicAlbum.Title = musicAlbumDto.Title;
            musicAlbum.ReleaseDate = DateTime.SpecifyKind(musicAlbumDto.ReleaseDate, DateTimeKind.Utc);

            await _context.SaveChangesAsync();
            return musicAlbum;
        }

        public async Task<MusicAlbum> AddMusicAlbumWithTracks(AddMusicAlbumWithMusicTracksDto dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            var uploadedMinioObjects = new List<string>();

            try
            {
                var musicAlbumId = Guid.NewGuid();

                var musicAlbum = new MusicAlbum
                {
                    Id = musicAlbumId,
                    Title = dto.Title,
                    UploadedAt = DateTime.UtcNow,
                    ReleaseDate = DateTime.SpecifyKind(dto.ReleaseDate, DateTimeKind.Utc),
                    CoverURL = ""
                };

                await _context.MusicAlbum.AddAsync(musicAlbum);
                await _context.SaveChangesAsync();

                if (dto.CoverImage != null)
                {
                    var coverUrl = await _minioFileService.UploadMusicAlbumCoverAsync(musicAlbum.Id, dto.CoverImage);
                    uploadedMinioObjects.Add(coverUrl);

                    musicAlbum.CoverURL = coverUrl;
                    _context.MusicAlbum.Update(musicAlbum);
                    await _context.SaveChangesAsync();
                }

                var musicTracks = new List<MusicTrack>();
                var musicTrackAlbums = new List<MusicTrackAlbum>();

                foreach (var musicTrackDto in dto.MusicTracks)
                {
                    var musicTrackId = Guid.NewGuid();

                    var duration = await _minioFileService.GetAudioDurationAsync(musicTrackDto.AudioFile);
                    var filePath = await _minioFileService.UploadAudioFileAsync(musicTrackId, musicTrackDto.AudioFile);
                    uploadedMinioObjects.Add(filePath);

                    string musicTrackCoverUrl;
                    if (musicTrackDto.CoverImage != null)
                    {
                        musicTrackCoverUrl = await _minioFileService.UploadMusicTrackCoverAsync(musicTrackId, musicTrackDto.CoverImage);
                    }
                    else
                    {
                        musicTrackCoverUrl = musicAlbum.CoverURL;
                    }

                    var musicTrack = new MusicTrack
                    {
                        Id = musicTrackId,
                        Title = musicTrackDto.Title,
                        ReleaseDate = DateTime.SpecifyKind(musicTrackDto.ReleaseDate, DateTimeKind.Utc),
                        IsExplicit = musicTrackDto.IsExplicit,
                        UploadedAt = DateTime.UtcNow,
                        Duration = duration,
                        FilePath = filePath,
                        CoverURL = musicTrackCoverUrl
                    };

                    var musicTrackAlbum = new MusicTrackAlbum
                    {
                        Id = Guid.NewGuid(),
                        MusicAlbumId = musicAlbum.Id,
                        MusicTrackId = musicTrackId,
                        Order = musicTrackDto.Order
                    };

                    musicTracks.Add(musicTrack);
                    musicTrackAlbums.Add(musicTrackAlbum);
                }

                await _context.MusicTrack.AddRangeAsync(musicTracks);
                await _context.MusicTrackAlbum.AddRangeAsync(musicTrackAlbums);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return musicAlbum;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Error while adding music album and its tracks: {ex.Message}");
                throw;
            }
        }
    }
}