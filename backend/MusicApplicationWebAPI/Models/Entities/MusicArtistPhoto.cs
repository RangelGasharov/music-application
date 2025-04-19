namespace MusicApplicationWebAPI.Models.Entities
{
    public class MusicArtistPhoto
    {
        public Guid Id { get; set; }
        public Guid MusicArtistId { get; set; }
        public required MusicArtist MusicArtist { get; set; }
        public required string FilePath { get; set; }
        public required DateTime UploadedAt { get; set; }
        public required bool IsPrimary { get; set; }
    }
}