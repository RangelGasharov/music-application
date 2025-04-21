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
        private readonly MinioImageService _minioImageService;
        public MusicAlbumRepository(AppDbContext dbContext, MinioImageService minioImageService)
        {
            _minioImageService = minioImageService;
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
                var coverUrl = await _minioImageService.UploadAlbumCoverAsync(musicAlbum.Id, musicAlbumDto.CoverImage); // ✳️ geändert
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

            await _minioImageService.DeleteAlbumCoverAsync(musicAlbum.Id);

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
                await _minioImageService.DeleteAlbumCoverAsync(musicAlbum.Id);
                var newCoverUrl = await _minioImageService.UploadAlbumCoverAsync(musicAlbum.Id, musicAlbumDto.CoverImage); // ✳️ geändert
                musicAlbum.CoverURL = newCoverUrl;
            }

            musicAlbum.Title = musicAlbumDto.Title;
            musicAlbum.ReleaseDate = DateTime.SpecifyKind(musicAlbumDto.ReleaseDate, DateTimeKind.Utc);

            await _context.SaveChangesAsync();
            return musicAlbum;
        }
    }
}