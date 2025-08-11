using Microsoft.EntityFrameworkCore;
using MusicApplicationWebAPI.Data;
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

        public async Task<MusicStream> CreateMusicStream(MusicStream musicStream)
        {
            if (musicStream.Id == Guid.Empty)
                musicStream.Id = Guid.NewGuid();

            await _context.MusicStream.AddAsync(musicStream);
            await _context.SaveChangesAsync();
            return musicStream;
        }
    }
}
