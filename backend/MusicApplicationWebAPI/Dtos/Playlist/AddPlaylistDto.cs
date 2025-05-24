namespace MusicApplicationWebAPI.Dtos.MusicAlbum
{
    public class AddPlaylistDto
    {
        public required Guid UserId { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public bool IsPublic { get; set; }
    }
}