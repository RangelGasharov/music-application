using MusicApplicationWebAPI.Models.Entities;

namespace MusicApplicationWebAPI.Interfaces
{
    public interface IQueueProgressRepository
    {
        Task<QueueProgress?> GetProgress(Guid userId, Guid queueId);
        Task<QueueProgress> SetProgress(Guid userId, Guid queueId, Guid queueItemId, TimeSpan progress);
    }
}