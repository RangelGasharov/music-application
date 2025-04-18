namespace MusicApplicationWebAPI.Models
{
    public class MusicArtistAlbum
    {
        public Guid Id { get; set; }
        public Guid MusicArtistId { get; set; }
        public MusicArtist MusicArtist { get; set; } = null!;
        public Guid MusicAlbumId { get; set; }
        public MusicAlbum MusicAlbum { get; set; } = null!;
    }
}