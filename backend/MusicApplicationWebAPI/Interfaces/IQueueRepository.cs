using MusicApplicationWebAPI.Models.Entities;

namespace MusicApplicationWebAPI.Interfaces
{
    public interface IQueueRepository
    {
        Task<Queue> GetQueue(Guid id);
        Task<Queue?> GetQueueByUserId(Guid userId);
        Task<List<QueueItem>> GetQueueItems(Guid queueId);
        Task<List<QueueItemWithMusicTrackDto>> GetQueueItemsWithTracks(Guid queueId);
        Task<bool> DeleteQueue(Guid queueId);
        Task<Queue> CreateQueue(Guid userId, string? name);
        Task<QueueItem> AddTrackToQueue(Guid queueId, Guid trackId);
        Task<QueueItem> ReorderTrack(Guid itemId, string? leftPos, string? rightPos);
    }
}