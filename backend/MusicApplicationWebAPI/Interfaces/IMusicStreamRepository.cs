using MusicApplicationWebAPI.Dtos;
using MusicApplicationWebAPI.Dtos.MusicArtist;
using MusicApplicationWebAPI.Dtos.MusicStream;
using MusicApplicationWebAPI.Dtos.MusicTrack;
using MusicApplicationWebAPI.Models.Entities;

namespace MusicApplicationWebAPI.Interfaces
{
    public interface IMusicStreamRepository
    {
        Task<List<MusicStream>> GetAllMusicStreams();
        Task<MusicStream> StartStream(Guid userId, Guid trackId);
        Task<MusicStream> EndStream(Guid streamId);
        Task<List<MusicStream>> GetStreamsByMusicArtistId(Guid artistId);
        Task<List<MusicStream>> GetStreamsByUserId(Guid userId);
        Task<List<TopStreamedMusicTrackDto>> GetTopMusicTracksToday();
        Task<List<TopStreamedMusicAlbumDto>> GetTopMusicAlbumsToday();
        Task<List<TopStreamedMusicArtistDto>> GetTopMusicArtistsOfUserThisMonth(Guid userId);
        Task<List<TopStreamedMusicTrackDto>> GetTopMusicTracksOfUserThisMonth(Guid userId);
        Task<List<TopStreamedMusicTrackDto>> GetTopMusicTracksOfMusicArtist(Guid artistId);
        Task<List<StreamCountPerDayDto>> GetMusicTrackStreamCountsInRange(Guid trackId, DateTime startDate, DateTime endDate);
        Task<List<StreamCountPerDayDto>> GetMusicAlbumStreamCountsInRange(Guid albumId, DateTime startDate, DateTime endDate);
    }
}