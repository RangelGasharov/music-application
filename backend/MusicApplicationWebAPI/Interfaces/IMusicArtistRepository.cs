using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MusicApplicationWebAPI.Dtos.MusicAlbum;
using MusicApplicationWebAPI.Dtos.MusicArtist;
using MusicApplicationWebAPI.Models.Entities;

namespace MusicApplicationWebAPI.Interfaces
{
    public interface IMusicArtistRepository
    {
        Task<List<MusicArtist>> GetAllMusicArtists();
        Task<MusicArtistDto?> GetMusicArtistById(Guid id);
        Task<MusicArtist> AddMusicArtist(MusicArtist musicArtist);
        Task<MusicArtist?> UpdateMusicArtist(Guid id, UpdateMusicArtistDto musicArtistDto);
        Task<MusicArtist?> DeleteMusicArtist(Guid id);
    }
}