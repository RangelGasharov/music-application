using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MusicApplicationWebAPI.Dtos.MusicAlbum;
using MusicApplicationWebAPI.Dtos.MusicTrack;
using MusicApplicationWebAPI.Models.Entities;

namespace MusicApplicationWebAPI.Interfaces
{
    public interface IMusicTrackRepository
    {
        Task<List<MusicTrackDto>> GetAllMusicTracks();
        Task<MusicTrackDto?> GetMusicTrackById(Guid id);
        Task<List<MusicTrackDto>> GetMusicTracksByMusicArtistId(Guid id);
        Task<MusicTrack> AddMusicTrack(AddMusicTrackDto addMusicTrackDto);
        Task<MusicTrack?> UpdateMusicTrack(Guid id, UpdateMusicTrackDto updateMusicTrackDto);
        Task<MusicTrack?> DeleteMusicTrack(Guid id);
    }
}