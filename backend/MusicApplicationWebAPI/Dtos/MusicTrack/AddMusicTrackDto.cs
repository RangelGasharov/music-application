namespace MusicApplicationWebAPI.Dtos.MusicAlbum
{
    public class AddMusicTrackDto
    {
        public required string Title { get; set; }
        public required DateTime ReleaseDate { get; set; }
        public required bool IsExplicit { get; set; }
        public required IFormFile CoverImage { get; set; }
        public required IFormFile AudioFile { get; set; }
    }
}