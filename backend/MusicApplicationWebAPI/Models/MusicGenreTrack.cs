namespace MusicApplicationWebAPI.Models
{
    public class MusicGenreTrack
    {
        public Guid Id { get; set; }
        public Guid MusicGenreId { get; set; }
        public required MusicGenre MusicGenre { get; set; }

        public Guid MusicTrackId { get; set; }
        public required MusicTrack MusicTrack { get; set; }
    }
}