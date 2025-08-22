using LexoAlgorithm;
using Microsoft.EntityFrameworkCore;
using MusicApplicationWebAPI.Data;
using MusicApplicationWebAPI.Dtos.MusicAlbum;
using MusicApplicationWebAPI.Dtos.MusicArtist;
using MusicApplicationWebAPI.Dtos.MusicGenre;
using MusicApplicationWebAPI.Dtos.MusicTrack;
using MusicApplicationWebAPI.Interfaces;
using MusicApplicationWebAPI.Models.Entities;

namespace MusicApplicationWebAPI.Repository
{
    public class QueueRepository : IQueueRepository
    {
        private readonly AppDbContext _context;

        public QueueRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Queue> GetQueue(Guid id)
        {
            return await _context.Queue
                .Include(q => q.Items.OrderBy(i => i.Position))
                .FirstOrDefaultAsync(q => q.Id == id)
                ?? throw new Exception("Queue not found");
        }

        public async Task<Queue?> GetQueueByUserId(Guid userId)
        {
            return await _context.Queue
                .Include(q => q.Items.OrderBy(i => i.Position))
                .FirstOrDefaultAsync(q => q.UserId == userId);
        }

        public async Task<bool> DeleteQueue(Guid queueId)
        {
            var queue = await _context.Queue
                .Include(q => q.Items)
                .FirstOrDefaultAsync(q => q.Id == queueId);

            if (queue == null)
                return false;

            _context.QueueItem.RemoveRange(queue.Items);
            _context.Queue.Remove(queue);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<List<QueueItem>> GetQueueItems(Guid queueId)
        {
            return await _context.QueueItem
                .Where(i => i.QueueId == queueId)
                .OrderBy(i => i.Position)
                .ToListAsync();
        }

        public async Task<List<QueueItemWithMusicTrackDto>> GetQueueItemsWithTracks(Guid queueId)
        {
            var items = await _context.QueueItem
                .Where(i => i.QueueId == queueId)
                .OrderBy(i => i.Position)
                .ToListAsync();

            var trackIds = items.Select(i => i.TrackId).Distinct().ToList();

            var tracks = await _context.MusicTrack
                .Where(t => trackIds.Contains(t.Id))
                .Include(t => t.MusicArtistTrack)
                    .ThenInclude(mat => mat.MusicArtist)
                .Include(t => t.MusicTrackAlbum)
                    .ThenInclude(mta => mta.MusicAlbum)
                .Include(t => t.MusicGenreTrack)
                    .ThenInclude(mgt => mgt.MusicGenre)
                .ToListAsync();

            var trackDict = tracks.ToDictionary(t => t.Id);

            var result = items.Select(item =>
            {
                if (!trackDict.TryGetValue(item.TrackId, out var track))
                {
                    return new QueueItemWithMusicTrackDto
                    {
                        Id = item.Id,
                        QueueId = item.QueueId,
                        TrackId = item.TrackId,
                        Position = item.Position,
                        AddedAt = item.AddedAt,
                        Track = null
                    };
                }

                var dto = new MusicTrackDto
                {
                    Id = track.Id,
                    Title = track.Title,
                    ReleaseDate = track.ReleaseDate,
                    FilePath = track.FilePath,
                    IsExplicit = track.IsExplicit,
                    UploadedAt = track.UploadedAt,
                    CoverURL = track.CoverURL,
                    Duration = track.Duration,

                    MusicArtists = track.MusicArtistTrack.Select(mat => new MusicArtistShortFormDto
                    {
                        Id = mat.MusicArtist.Id,
                        Name = mat.MusicArtist.Name
                    }).ToList(),

                    MusicAlbums = track.MusicTrackAlbum.Select(mta => new MusicAlbumShortFormDto
                    {
                        Id = mta.MusicAlbum.Id,
                        Title = mta.MusicAlbum.Title,
                        CoverURL = mta.MusicAlbum.CoverURL,
                        UploadedAt = mta.MusicAlbum.UploadedAt,
                        ReleaseDate = mta.MusicAlbum.ReleaseDate
                    }).ToList(),

                    MusicGenres = track.MusicGenreTrack.Select(mgt => new MusicGenreDto
                    {
                        Id = mgt.MusicGenre.Id,
                        Name = mgt.MusicGenre.Name
                    }).ToList()
                };

                return new QueueItemWithMusicTrackDto
                {
                    Id = item.Id,
                    QueueId = item.QueueId,
                    TrackId = item.TrackId,
                    Position = item.Position,
                    AddedAt = item.AddedAt,
                    Track = dto
                };
            }).ToList();

            return result;
        }

        public async Task<bool> DeleteQueueItemByPosition(Guid queueId, string position)
        {
            var item = await _context.QueueItem
                .FirstOrDefaultAsync(i => i.QueueId == queueId && i.Position == position);

            if (item == null)
                return false;

            _context.QueueItem.Remove(item);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<Queue> CreateQueue(Guid userId, string? name)
        {
            var queue = new Queue
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = name,
                CreatedAt = DateTime.UtcNow
            };

            _context.Queue.Add(queue);
            await _context.SaveChangesAsync();
            return queue;
        }

        public async Task<QueueItemWithMusicTrackDto> AddTrackToQueue(Guid queueId, Guid trackId)
        {
            var lastItem = await _context.QueueItem
                .Where(i => i.QueueId == queueId)
                .OrderByDescending(i => i.Position)
                .FirstOrDefaultAsync();

            var newRank = lastItem == null
                ? LexoRank.Middle()
                : LexoRank.Parse(lastItem.Position).Between(LexoRank.Max());

            var item = new QueueItem
            {
                Id = Guid.NewGuid(),
                QueueId = queueId,
                TrackId = trackId,
                Position = newRank.ToString(),
                AddedAt = DateTime.UtcNow
            };

            _context.QueueItem.Add(item);
            await _context.SaveChangesAsync();

            if (item.Position.Length >= 40)
            {
                await RebalanceQueue(queueId);
            }

            var dto = await _context.QueueItem
                .Where(q => q.Id == item.Id)
                .Select(q => new QueueItemWithMusicTrackDto
                {
                    Id = q.Id,
                    QueueId = q.QueueId,
                    TrackId = q.TrackId,
                    Position = q.Position,
                    AddedAt = q.AddedAt,
                    Track = _context.MusicTrack
                        .Where(t => t.Id == q.TrackId)
                        .Select(t => new MusicTrackDto
                        {
                            Id = t.Id,
                            Title = t.Title,
                            ReleaseDate = t.ReleaseDate,
                            FilePath = t.FilePath,
                            IsExplicit = t.IsExplicit,
                            UploadedAt = t.UploadedAt,
                            CoverURL = t.CoverURL,
                            Duration = t.Duration,
                            MusicArtists = t.MusicArtistTrack
                                .Select(mat => new MusicArtistShortFormDto
                                {
                                    Id = mat.MusicArtist.Id,
                                    Name = mat.MusicArtist.Name
                                })
                                .ToList(),
                            MusicAlbums = t.MusicTrackAlbum
                                .Select(mta => new MusicAlbumShortFormDto
                                {
                                    Id = mta.MusicAlbum.Id,
                                    Title = mta.MusicAlbum.Title,
                                    CoverURL = mta.MusicAlbum.CoverURL,
                                    UploadedAt = mta.MusicAlbum.UploadedAt,
                                    ReleaseDate = mta.MusicAlbum.ReleaseDate
                                })
                                .ToList(),
                            MusicGenres = t.MusicGenreTrack
                                .Select(mgt => new MusicGenreDto
                                {
                                    Id = mgt.MusicGenre.Id,
                                    Name = mgt.MusicGenre.Name
                                })
                                .ToList()
                        })
                        .FirstOrDefault()
                })
                .FirstAsync();

            return dto;
        }

        public async Task<QueueItem> ReorderTrack(Guid itemId, string? leftPos, string? rightPos)
        {
            var item = await _context.QueueItem.FindAsync(itemId);
            if (item == null) throw new Exception("Queue item not found");

            var left = string.IsNullOrEmpty(leftPos) ? LexoRank.Min() : LexoRank.Parse(leftPos);
            var right = string.IsNullOrEmpty(rightPos) ? LexoRank.Max() : LexoRank.Parse(rightPos);

            var newRank = left.Between(right);
            item.Position = newRank.ToString();

            await _context.SaveChangesAsync();

            if (item.Position.Length >= 40)
            {
                await RebalanceQueue(item.QueueId);
            }

            return item;
        }

        private async Task RebalanceQueue(Guid queueId)
        {
            var items = await _context.QueueItem
                .Where(q => q.QueueId == queueId)
                .OrderBy(q => q.Position)
                .ToListAsync();

            var rank = LexoRank.Middle();
            foreach (var item in items)
            {
                item.Position = rank.ToString();
                rank = rank.Between(LexoRank.Max());
            }

            await _context.SaveChangesAsync();
        }
    }
}