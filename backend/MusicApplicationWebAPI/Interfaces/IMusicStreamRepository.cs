using MusicApplicationWebAPI.Models.Entities;

namespace MusicApplicationWebAPI.Interfaces
{
    public interface IMusicStreamRepository
    {
        Task<List<MusicStream>> GetAllMusicStreams();
        Task<MusicStream> CreateMusicStream(MusicStream musicStream);
    }
}