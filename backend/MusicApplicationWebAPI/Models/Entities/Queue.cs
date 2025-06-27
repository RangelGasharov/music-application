namespace MusicApplicationWebAPI.Models.Entities
{
    public class Queue
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string? Name { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<QueueItem> Items { get; set; } = new List<QueueItem>();
    }
}