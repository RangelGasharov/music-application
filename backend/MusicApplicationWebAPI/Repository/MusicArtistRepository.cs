using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MusicApplicationWebAPI.Data;
using MusicApplicationWebAPI.Dtos.MusicAlbum;
using MusicApplicationWebAPI.Dtos.MusicArtist;
using MusicApplicationWebAPI.Interfaces;
using MusicApplicationWebAPI.Models.Entities;

namespace MusicApplicationWebAPI.Repository
{
    public class MusicArtistRepository : IMusicArtistRepository
    {
        private readonly AppDbContext _context;

        public MusicArtistRepository(AppDbContext dbContext)
        {
            _context = dbContext;
        }
        public async Task<MusicArtist> AddMusicArtist(MusicArtist musicArtist)
        {
            await _context.MusicArtist.AddAsync(musicArtist);
            await _context.SaveChangesAsync();
            return musicArtist;
        }

        public async Task<MusicArtist?> DeleteMusicArtist(Guid id)
        {
            var musicArtist = await _context.MusicArtist.FindAsync(id);
            if (musicArtist is null)
            {
                return null;
            }

            _context.MusicArtist.Remove(musicArtist);
            await _context.SaveChangesAsync();
            return musicArtist;
        }

        public async Task<List<MusicArtist>> GetAllMusicArtists()
        {
            return await _context.MusicArtist.ToListAsync();
        }

        public async Task<MusicArtistDto?> GetMusicArtistById(Guid id)
        {
            var musicArtist = await _context.MusicArtist
                .Include(artist => artist.MusicArtistAlbums)
                .ThenInclude(artist_album => artist_album.MusicAlbum)
                .FirstOrDefaultAsync(artist => artist.Id == id);

            if (musicArtist is null)
            {
                return null;
            }

            var musicArtistDto = new MusicArtistDto
            {
                Id = musicArtist.Id,
                Name = musicArtist.Name,
                Description = musicArtist.Description,
                FirstName = musicArtist.FirstName,
                LastName = musicArtist.LastName,
                BirthDate = musicArtist.BirthDate,
                MusicAlbums = musicArtist.MusicArtistAlbums
                    .Select(musicAlbum => new MusicAlbumShortFormDto
                    {
                        Id = musicAlbum.MusicAlbum.Id,
                        Title = musicAlbum.MusicAlbum.Title,
                        CoverURL = musicAlbum.MusicAlbum.CoverURL,
                        UploadedAt = musicAlbum.MusicAlbum.UploadedAt,
                        ReleaseDate = musicAlbum.MusicAlbum.ReleaseDate
                    }).ToList()
            };

            return musicArtistDto;
        }

        public async Task<MusicArtist?> UpdateMusicArtist(Guid id, UpdateMusicArtistDto musicArtistDto)
        {
            var musicArtist = await _context.MusicArtist.FindAsync(id);
            if (musicArtist is null)
            {
                return null;
            }

            musicArtist.Name = musicArtistDto.Name;
            musicArtist.Description = musicArtistDto.Description;
            musicArtist.FirstName = musicArtistDto.FirstName;
            musicArtist.LastName = musicArtistDto.LastName;
            musicArtist.BirthDate = musicArtistDto.BirthDate;

            await _context.SaveChangesAsync();
            return musicArtist;
        }
    }
}