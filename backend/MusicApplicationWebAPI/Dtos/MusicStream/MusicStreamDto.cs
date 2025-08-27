namespace MusicApplicationWebAPI.Dtos.MusicStream
{
    public class StartMusicStreamDto
    {
        public Guid UserId { get; set; }
        public Guid TrackId { get; set; }
    }

    public class EndMusicStreamDto
    {
        public Guid StreamId { get; set; }
    }

    public class StreamCountPerDayDto
    {
        public DateTime Date { get; set; }
        public int TotalStreams { get; set; }
    }
}