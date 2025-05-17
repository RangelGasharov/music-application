namespace MusicApplicationWebAPI.Dtos.MusicArtist;

public class MusicArtistPhotoDto
{
    public Guid Id { get; set; }
    public required string FilePath { get; set; }
    public DateTime UploadedAt { get; set; }
    public bool IsPrimary { get; set; }
}