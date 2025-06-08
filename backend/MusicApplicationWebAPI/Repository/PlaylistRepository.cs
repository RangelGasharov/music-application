using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MusicApplicationWebAPI.Data;
using MusicApplicationWebAPI.Dtos.MusicAlbum;
using MusicApplicationWebAPI.Interfaces;
using MusicApplicationWebAPI.Models.Entities;

namespace MusicApplicationWebAPI.Repository
{
    public class PlaylistRepository : IPlaylistRepository
    {
        private readonly AppDbContext _context;

        public PlaylistRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Playlist>> GetAllPlaylists()
        {
            return await _context.Playlist.ToListAsync();
        }

        public async Task<Playlist?> GetPlaylistById(Guid id)
        {
            return await _context.Playlist.FindAsync(id);
        }

        public async Task<Playlist> AddPlaylist(AddPlaylistDto addPlaylistDto)
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

        public async Task<Playlist?> UpdatePlaylist(Guid id, Playlist updatedPlaylist)
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
        public async Task<Playlist?> DeletePlaylist(Guid id)
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

        public async Task<Playlist> AddPlaylist(AddMusicAlbumDto addMusicAlbumDto)
        {
            throw new NotImplementedException();
        }

        public async Task<Playlist?> UpdatePlaylist(Guid id, UpdateMusicAlbumDto musicAlbumDto)
        {
            throw new NotImplementedException();
        }

        public async Task<Playlist> AddPlaylistWithTracks(AddPlaylistWithMusicTracksDto dto)
        {
            var playlist = new Playlist
            {
                Id = Guid.NewGuid(),
                Title = dto.Title,
                Description = dto.Description,
                UserId = dto.UserId,
                CreatedAt = dto.CreatedAt,
                UpdatedAt = dto.UpdatedAt,
                IsPublic = dto.IsPublic,
                CoverURL = string.Empty
            };

            _context.Playlist.Add(playlist);

            var existingPositions = new HashSet<int>();

            foreach (var musicTrackDto in dto.MusicTracks)
            {
                if (!existingPositions.Add(musicTrackDto.Position))
                {
                    throw new InvalidOperationException($"Duplicate position in playlist: {musicTrackDto.Position}");
                }

                var musicTrack = await _context.MusicTrack.FindAsync(musicTrackDto.TrackId);
                if (musicTrack == null)
                {
                    throw new KeyNotFoundException($"Track with ID {musicTrackDto.TrackId} could not be found.");
                }

                var musicTrackPlaylist = new MusicTrackPlaylist
                {
                    Id = Guid.NewGuid(),
                    PlayListId = playlist.Id,
                    TrackId = musicTrack.Id,
                    Playlist = playlist,
                    MusicTrack = musicTrack,
                    Position = musicTrackDto.Position,
                    AddedAt = dto.CreatedAt
                };

                _context.MusicTrackPlaylist.Add(musicTrackPlaylist);
            }

            await _context.SaveChangesAsync();
            return playlist;
        }

    }
}