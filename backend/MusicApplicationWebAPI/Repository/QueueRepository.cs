using LexoAlgorithm;
using Microsoft.EntityFrameworkCore;
using MusicApplicationWebAPI.Data;
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

        public async Task<QueueItem> AddTrackToQueue(Guid queueId, int trackId)
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
            return item;
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
            return item;
        }
    }
}