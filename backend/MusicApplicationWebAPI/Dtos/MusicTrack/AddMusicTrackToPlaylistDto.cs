namespace MusicApplicationWebAPI.Dtos.MusicTrack
{
    public class AddMusicTrackToPlaylistDto
    {
        public required Guid TrackId { get; set; }
        public int Position { get; set; }
        public required DateTime AddedAt { get; set; }
    }
}