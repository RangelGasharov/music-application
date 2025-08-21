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

        public async Task<List<MusicStream>> GetStreamsByMusicArtistId(Guid artistId)
        {
            return await _context.MusicStream
                .Where(ms => ms.MusicTrack.MusicArtistTrack
                    .Any(mat => mat.MusicArtistId == artistId))
                .ToListAsync();
        }

        public async Task<List<MusicStream>> GetStreamsByUserId(Guid userId)
        {
            return await _context.MusicStream
                .Where(ms => ms.UserId == userId)
                .ToListAsync();
        }

        public async Task<MusicStream> StartStream(Guid userId, Guid trackId)
        {
            var musicStream = new MusicStream
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                TrackId = trackId,
                StartTime = DateTime.UtcNow,
                Counted = false
            };

            await _context.MusicStream.AddAsync(musicStream);
            await _context.SaveChangesAsync();
            return musicStream;
        }

        public async Task<MusicStream> EndStream(Guid streamId)
        {
            var stream = await _context.MusicStream.FindAsync(streamId);
            if (stream == null)
                throw new Exception("Stream not found");

            stream.EndTime = DateTime.UtcNow;
            stream.Duration = stream.EndTime - stream.StartTime;

            bool enoughTimePlayed = stream.Duration.HasValue &&
                                    stream.Duration.Value >= TimeSpan.FromSeconds(30);

            var cooldownCutoff = DateTime.UtcNow.AddMinutes(-10);
            bool passedCooldown = !await _context.MusicStream.AnyAsync(s =>
                s.UserId == stream.UserId &&
                s.TrackId == stream.TrackId &&
                s.Counted &&
                s.EndTime != null &&
                s.EndTime >= cooldownCutoff
            );

            var dayStartUtc = DateTime.UtcNow.Date;
            var nextDayStartUtc = dayStartUtc.AddDays(1);

            int playsToday = await _context.MusicStream.CountAsync(s =>
                s.UserId == stream.UserId &&
                s.TrackId == stream.TrackId &&
                s.Counted &&
                s.EndTime != null &&
                s.EndTime >= dayStartUtc &&
                s.EndTime < nextDayStartUtc
            );

            bool underDailyLimit = playsToday < 50;

            stream.Counted = enoughTimePlayed && passedCooldown && underDailyLimit;

            await _context.SaveChangesAsync();
            return stream;
        }
    }
}
