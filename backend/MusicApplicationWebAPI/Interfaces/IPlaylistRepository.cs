using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MusicApplicationWebAPI.Dtos.MusicAlbum;
using MusicApplicationWebAPI.Models.Entities;

namespace MusicApplicationWebAPI.Interfaces
{
    public interface IPlaylistRepository
    {
        Task<List<Playlist>> GetAllPlaylists();
        Task<Playlist?> GetPlaylistById(Guid id);
        Task<Playlist> AddPlaylist(AddMusicAlbumDto addMusicAlbumDto);
        Task<Playlist?> UpdatePlaylist(Guid id, UpdateMusicAlbumDto musicAlbumDto);
        Task<Playlist?> DeletePlaylist(Guid id);
        Task<Playlist> AddPlaylistWithTracks(AddPlaylistWithMusicTracksDto dto);
    }
}