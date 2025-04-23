namespace MusicApplicationWebAPI.Dtos.MusicAlbum
{
    public class UpdateMusicTrackDto
    {
        public required string Title { get; set; }
        public required DateTime ReleaseDate { get; set; }
        public required bool IsExplicit { get; set; }
        public required IFormFile CoverImage { get; set; }
        public required IFormFile AudioFile { get; set; }
    }
}