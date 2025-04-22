namespace MusicApplicationWebAPI.Models.Entities
{
    public class MusicTrackPlaylist
    {
        public Guid Id { get; set; }
        public Guid PlayListId { get; set; }
        public Guid TrackId { get; set; }
        public required Playlist Playlist { get; set; }
        public required MusicTrack MusicTrack { get; set; }
    }
}