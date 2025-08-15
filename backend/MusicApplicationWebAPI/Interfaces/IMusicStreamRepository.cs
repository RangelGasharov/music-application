using MusicApplicationWebAPI.Models.Entities;

namespace MusicApplicationWebAPI.Interfaces
{
    public interface IMusicStreamRepository
    {
        Task<List<MusicStream>> GetAllMusicStreams();
        Task<MusicStream> StartStream(Guid userId, Guid trackId);
        Task<MusicStream> EndStream(Guid streamId);
    }
}