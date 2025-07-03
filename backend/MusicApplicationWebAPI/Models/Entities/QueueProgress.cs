namespace MusicApplicationWebAPI.Models.Entities
{
    public class QueueProgress
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid UserId { get; set; }
        public Guid QueueId { get; set; }
        public Guid QueueItemId { get; set; }
        public TimeSpan Progress { get; set; } = TimeSpan.Zero;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public Queue Queue { get; set; } = null!;
        public QueueItem QueueItem { get; set; } = null!;
    }
}