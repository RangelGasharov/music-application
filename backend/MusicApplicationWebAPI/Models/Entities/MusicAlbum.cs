namespace MusicApplicationWebAPI.Models.Entities
{
    public class MusicAlbum
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public required string CoverURL { get; set; }
        public required DateTime UploadedAt { get; set; }
        public required DateTime ReleaseDate { get; set; }
        public ICollection<MusicArtistAlbum> MusicArtistAlbums { get; set; } = [];
        public ICollection<MusicTrackAlbum> MusicTrackAlbums { get; set; } = [];
    }
}