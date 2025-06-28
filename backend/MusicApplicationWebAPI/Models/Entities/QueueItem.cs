namespace MusicApplicationWebAPI.Models.Entities
{
    public class QueueItem
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid QueueId { get; set; }
        public Guid TrackId { get; set; }
        public string Position { get; set; } = string.Empty;
        public DateTime AddedAt { get; set; } = DateTime.UtcNow;

        public Queue Queue { get; set; } = null!;
    }
}