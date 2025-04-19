namespace MusicApplicationWebAPI.Dtos.MusicAlbum
{
    public class UpdateMusicArtistDto
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateTime? BirthDate { get; set; }
    }
}