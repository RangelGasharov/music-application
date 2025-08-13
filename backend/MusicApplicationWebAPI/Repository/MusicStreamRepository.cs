using Microsoft.EntityFrameworkCore;
using MusicApplicationWebAPI.Data;
using MusicApplicationWebAPI.Dtos.MusicAlbum;
using MusicApplicationWebAPI.Interfaces;
using MusicApplicationWebAPI.Models.Entities;

namespace MusicApplicationWebAPI.Repository
{
    public class MusicStreamsRepository : IMusicStreamRepository
    {
        private readonly AppDbContext _context;

        public MusicStreamsRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<MusicStream>> GetAllMusicStreams()
        {
            return await _context.MusicStream
                .Include(ms => ms.MusicTrack)
                .ToListAsync();
        }

        public async Task<MusicStream> AddMusicStream(AddMusicStreamDto addMusicStreamDto)
        {
            var musicStream = new MusicStream
            {
                UserId = addMusicStreamDto.UserId,
                TrackId = addMusicStreamDto.TrackId,
                StartTime = addMusicStreamDto.StartTime,
                EndTime = addMusicStreamDto.EndTime,
                Duration = addMusicStreamDto.EndTime - addMusicStreamDto.StartTime
            };

            await _context.MusicStream.AddAsync(musicStream);
            await _context.SaveChangesAsync();
            return musicStream;
        }
    }
}
