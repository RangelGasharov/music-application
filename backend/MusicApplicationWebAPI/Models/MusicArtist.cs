namespace MusicApplicationWebAPI.Models
{
    public class MusicArtist
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateTime? BirthDate { get; set; }
        public List<MusicArtistAlbum> MusicArtistAlbums { get; set; } = [];
    }
}