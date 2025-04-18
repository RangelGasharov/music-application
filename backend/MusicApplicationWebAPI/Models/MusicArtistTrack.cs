namespace MusicApplicationWebAPI.Models
{
    public class MusicArtistTrack
    {
        public Guid Id { get; set; }
        public Guid MusicArtistId { get; set; }
        public required MusicArtist MusicArtist { get; set; }

        public Guid MusicTrackId { get; set; }
        public required MusicTrack MusicTrack { get; set; }
    }
}