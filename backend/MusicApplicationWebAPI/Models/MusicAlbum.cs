namespace MusicApplicationWebAPI.Models
{
    public class MusicAlbum
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public required string CoverURL { get; set; }
        public required DateTime UploadedAt { get; set; }
        public required DateTime ReleaseDate { get; set; }
        public List<MusicArtistAlbum> MusicArtistAlbums { get; set; } = [];
    }
}