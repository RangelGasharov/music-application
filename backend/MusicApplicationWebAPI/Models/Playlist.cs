namespace MusicApplicationWebAPI.Models
{
    public class Playlist
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public required DateTime CreatedAt { get; set; }
        public required DateTime UpdatedAt { get; set; }
        public required string CoverURL { get; set; }
        public required bool IsPublic { get; set; }
    }
}