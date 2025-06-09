namespace MusicApplicationWebAPI.Models.Entities
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
        public ICollection<MusicArtistTrack> MusicArtistTrack { get; set; } = [];
        public ICollection<MusicTrackAlbum> MusicTrackAlbums { get; set; } = [];
        public ICollection<MusicGenreTrack> MusicGenreTrack { get; set; } = [];
        public ICollection<MusicTrackPlaylist> MusicTrackPlaylists { get; set; } = [];
    }
}