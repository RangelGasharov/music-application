namespace MusicApplicationWebAPI.Models
{
    public class MusicTrack
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public required DateTime ReleaseDate { get; set; }
        public required string FilePath { get; set; }
        public required bool IsExplicit { get; set; }
        public required DateTime UploadedAt { get; set; }
        public required string CoverURL { get; set; }
        public required TimeSpan Duration { get; set; }
        public List<MusicArtistTrack> MusicArtistTrack { get; set; } = [];
        public List<MusicGenreTrack> MusicGenreTrack { get; set; } = [];
    }
}