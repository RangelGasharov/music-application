namespace MusicApplicationWebAPI.Models.Entities
{
    public class MusicArtist
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateTime? BirthDate { get; set; }
        public ICollection<MusicArtistAlbum> MusicArtistAlbums { get; set; } = [];
        public ICollection<MusicArtistTrack> MusicArtistTracks { get; set; } = [];
    }
}