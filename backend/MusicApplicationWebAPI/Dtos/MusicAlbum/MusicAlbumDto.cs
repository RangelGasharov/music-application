using MusicApplicationWebAPI.Dtos.MusicArtist;

namespace MusicApplicationWebAPI.Dtos
{
    public class MusicAlbumDto
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public required string CoverURL { get; set; }
        public required DateTime UploadedAt { get; set; }
        public required DateTime ReleaseDate { get; set; }
        public string? Description { get; set; }
        public List<MusicArtistShortFormDto> MusicArtists { get; set; } = [];
    }

    public class TopStreamedMusicAlbumDto
    {
        public Guid AlbumId { get; set; }
        public required string Title { get; set; }
        public int TotalPlays { get; set; }
    }
}