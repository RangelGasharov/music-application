namespace MusicApplicationWebAPI.Dtos.MusicAlbum
{
    public class UpdateMusicTrackDto
    {
        public string? Title { get; set; }
        public DateTime? ReleaseDate { get; set; }
        public bool? IsExplicit { get; set; }
        public IFormFile? CoverImage { get; set; }
        public IFormFile? AudioFile { get; set; }
    }
}