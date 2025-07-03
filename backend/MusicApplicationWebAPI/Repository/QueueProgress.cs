using Microsoft.EntityFrameworkCore;
using MusicApplicationWebAPI.Data;
using MusicApplicationWebAPI.Interfaces;
using MusicApplicationWebAPI.Models.Entities;

public class QueueProgressRepository : IQueueProgressRepository
{
    private readonly AppDbContext _context;

    public QueueProgressRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<QueueProgress?> GetProgress(Guid userId, Guid queueId)
    {
        return await _context.QueueProgress
            .FirstOrDefaultAsync(qp => qp.UserId == userId && qp.QueueId == queueId);
    }

    public async Task<QueueProgress> SetProgress(Guid userId, Guid queueId, Guid queueItemId, TimeSpan progress)
    {
        var existing = await _context.QueueProgress
            .FirstOrDefaultAsync(qp => qp.UserId == userId && qp.QueueId == queueId);

        if (existing is not null)
        {
            existing.QueueItemId = queueItemId;
            existing.Progress = progress;
            existing.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            existing = new QueueProgress
            {
                UserId = userId,
                QueueId = queueId,
                QueueItemId = queueItemId,
                Progress = progress
            };
            _context.QueueProgress.Add(existing);
        }

        await _context.SaveChangesAsync();
        return existing;
    }
}
