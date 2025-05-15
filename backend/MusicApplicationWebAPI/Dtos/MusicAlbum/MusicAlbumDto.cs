using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MusicApplicationWebAPI.Dtos.MusicAlbum;
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
}