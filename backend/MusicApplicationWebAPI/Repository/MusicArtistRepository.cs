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

        public async Task<List<MusicArtistDto>> GetAllMusicArtists()
        {
            var musicArtists = await _context.MusicArtist
            .Include(music_artist => music_artist.MusicArtistAlbums)
            .ThenInclude(music_artist_album => music_artist_album.MusicAlbum)
            .ToListAsync();

            return [.. musicArtists.Select(music_artist => new MusicArtistDto
            {
                Id = music_artist.Id,
                Name = music_artist.Name,
                Description = music_artist.Description,
                FirstName = music_artist.FirstName,
                LastName = music_artist.LastName,
                BirthDate= music_artist.BirthDate,
                MusicAlbums = [.. music_artist.MusicArtistAlbums
                    .Select(music_artist_album => new MusicAlbumShortFormDto
                    {
                        Id = music_artist_album.MusicAlbum.Id,
                        Title = music_artist_album.MusicAlbum.Title,
                        CoverURL =  music_artist_album.MusicAlbum.CoverURL,
                        UploadedAt = music_artist_album.MusicAlbum.UploadedAt,
                        ReleaseDate = music_artist_album.MusicAlbum.ReleaseDate
                    })]
            })];
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