namespace MusicApplicationWebAPI.Models.Entities
{
    public class Playlist
    {
        public Guid Id { get; set; }
        public required Guid UserId { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public required DateTime CreatedAt { get; set; }
        public required DateTime UpdatedAt { get; set; }
        public string? CoverURL { get; set; }
        public required bool IsPublic { get; set; }
        public ICollection<MusicTrackPlaylist> MusicTrackPlaylists { get; set; } = [];
    }
}