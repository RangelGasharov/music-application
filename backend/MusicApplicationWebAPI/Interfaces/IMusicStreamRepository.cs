using MusicApplicationWebAPI.Dtos.MusicAlbum;
using MusicApplicationWebAPI.Models.Entities;

namespace MusicApplicationWebAPI.Interfaces
{
    public interface IMusicStreamRepository
    {
        Task<List<MusicStream>> GetAllMusicStreams();
        Task<MusicStream> AddMusicStream(AddMusicStreamDto addMusicStreamDto);
    }
}