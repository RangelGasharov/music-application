using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
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
        public MusicAlbumRepository(AppDbContext dbContext)
        {
            _context = dbContext;
        }

        public async Task<MusicAlbum> AddMusicAlbum(MusicAlbum musicAlbum)
        {
            await _context.MusicAlbum.AddAsync(musicAlbum);
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

            musicAlbum.Title = musicAlbumDto.Title;
            musicAlbum.CoverURL = musicAlbumDto.CoverURL;
            musicAlbum.UploadedAt = musicAlbumDto.UploadedAt;
            musicAlbum.ReleaseDate = musicAlbumDto.ReleaseDate;

            await _context.SaveChangesAsync();
            return musicAlbum;
        }
    }
}