namespace MusicApplicationWebAPI.Dtos.MusicAlbum
{
    public class AddMusicStreamDto
    {
        public required Guid UserId { get; set; }
        public required Guid TrackId { get; set; }
        public required DateTime StartTime { get; set; }
        public required DateTime EndTime { get; set; }
        public TimeSpan? Duration { get; set; }
    }
}