namespace MusicApplicationWebAPI.Dtos.MusicTrack
{
    public class AddMusicTrackToMusicAlbumDto
    {
        public required string Title { get; set; }
        public required DateTime ReleaseDate { get; set; }
        public required bool IsExplicit { get; set; }
        public IFormFile? CoverImage { get; set; }
        public required IFormFile AudioFile { get; set; }
        public int Position { get; set; }
    }
}