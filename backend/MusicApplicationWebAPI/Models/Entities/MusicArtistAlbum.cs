namespace MusicApplicationWebAPI.Models.Entities
{
    public class MusicArtistAlbum
    {
        public Guid Id { get; set; }
        public Guid MusicArtistId { get; set; }
        public Guid MusicAlbumId { get; set; }
        public required MusicArtist MusicArtist { get; set; }
        public required MusicAlbum MusicAlbum { get; set; }
    }
}