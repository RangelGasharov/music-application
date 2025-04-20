namespace MusicApplicationWebAPI.Dtos.MusicAlbum
{
    public class UpdateMusicAlbumDto
    {
        public required string Title { get; set; }
        public required DateTime ReleaseDate { get; set; }
        public required IFormFile CoverImage { get; set; }
    }
}