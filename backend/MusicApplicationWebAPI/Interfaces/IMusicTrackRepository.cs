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
        Task<List<MusicTrackWithPositionDto>> GetMusicTracksByMusicAlbumId(Guid id);
        Task<List<MusicTrackWithPositionDto>> GetMusicTracksPlaylistId(Guid playlistId);
        Task<MusicTrack> AddMusicTrack(AddMusicTrackDto addMusicTrackDto);
        Task<MusicTrack?> UpdateMusicTrack(Guid id, UpdateMusicTrackDto updateMusicTrackDto);
        Task<MusicTrack?> DeleteMusicTrack(Guid id);
    }
}