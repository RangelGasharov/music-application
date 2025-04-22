namespace MusicApplicationWebAPI.Models.Entities
{
    public class MusicTrackAlbum
    {
        public Guid Id { get; set; }
        public Guid MusicTrackId { get; set; }
        public Guid MusicAlbumId { get; set; }
        public required MusicTrack MusicTrack { get; set; }
        public required MusicAlbum MusicAlbum { get; set; }
    }
}