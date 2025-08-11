namespace MusicApplicationWebAPI.Models.Entities
{
    public class MusicStream
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid TrackId { get; set; }
        public required DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public TimeSpan Duration { get; set; }
        public required MusicTrack MusicTrack { get; set; }
    }
}