using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MusicApplicationWebAPI.Data;
using MusicApplicationWebAPI.Dtos.MusicAlbum;
using MusicApplicationWebAPI.Models.Entities;

namespace MusicApplicationWebAPI.Repository
{
    public class PlaylistRepository
    {
        private readonly AppDbContext _context;

        public PlaylistRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Playlist>> GetAllPlaylistsAsync()
        {
            return await _context.Playlist.ToListAsync();
        }

        public async Task<Playlist?> GetPlaylistByIdAsync(Guid id)
        {
            return await _context.Playlist.FindAsync(id);
        }

        public async Task<Playlist> AddPlaylistAsync(AddPlaylistDto addPlaylistDto)
        {
            var playlist = new Playlist
            {
                Id = Guid.NewGuid(),
                UserId = addPlaylistDto.UserId,
                Title = addPlaylistDto.Title,
                Description = addPlaylistDto.Description,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                IsPublic = addPlaylistDto.IsPublic
            };

            await _context.Playlist.AddAsync(playlist);
            await _context.SaveChangesAsync();
            return playlist;
        }

        public async Task<Playlist?> UpdatePlaylistAsync(Guid id, Playlist updatedPlaylist)
        {
            var existingPlaylist = await _context.Playlist.FindAsync(id);
            if (existingPlaylist == null)
            {
                return null;
            }

            existingPlaylist.Title = updatedPlaylist.Title;
            existingPlaylist.Description = updatedPlaylist.Description;
            existingPlaylist.CoverURL = updatedPlaylist.CoverURL;
            existingPlaylist.IsPublic = updatedPlaylist.IsPublic;
            existingPlaylist.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existingPlaylist;
        }
        public async Task<Playlist?> DeletePlaylistAsync(Guid id)
        {
            var playlist = await _context.Playlist.FindAsync(id);
            if (playlist == null)
            {
                return null;
            }

            _context.Playlist.Remove(playlist);
            await _context.SaveChangesAsync();
            return playlist;
        }
    }
}