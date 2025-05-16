using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MusicApplicationWebAPI.Dtos;
using MusicApplicationWebAPI.Dtos.MusicAlbum;
using MusicApplicationWebAPI.Models.Entities;

namespace MusicApplicationWebAPI.Interfaces
{
    public interface IMusicAlbumRepository
    {
        Task<List<MusicAlbumDto>> GetAllMusicAlbums();
        Task<MusicAlbumDto?> GetMusicAlbumById(Guid id);
        Task<List<MusicAlbumDto>> GetMusicAlbumsByMusicArtistId(Guid artistId);
        Task<MusicAlbum> AddMusicAlbum(AddMusicAlbumDto addMusicAlbumDto);
        Task<MusicAlbum?> UpdateMusicAlbum(Guid id, UpdateMusicAlbumDto musicAlbumDto);
        Task<MusicAlbum?> DeleteMusicAlbum(Guid id);
        Task<MusicAlbum> AddMusicAlbumWithTracks(AddMusicAlbumWithMusicTracksDto dto);
    }
}