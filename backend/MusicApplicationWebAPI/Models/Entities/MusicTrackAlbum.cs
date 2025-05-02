namespace MusicApplicationWebAPI.Models.Entities
{
    public class MusicTrackAlbum
    {
        public Guid Id { get; set; }
        public Guid MusicTrackId { get; set; }
        public Guid MusicAlbumId { get; set; }
        public int Order { get; set; }
        public MusicTrack? MusicTrack { get; set; }
        public MusicAlbum? MusicAlbum { get; set; }
    }
}