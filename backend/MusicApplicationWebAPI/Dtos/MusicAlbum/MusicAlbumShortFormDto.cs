using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicApplicationWebAPI.Dtos.MusicAlbum
{
    public class MusicAlbumShortFormDto
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public required string CoverURL { get; set; }
        public required DateTime UploadedAt { get; set; }
        public required DateTime ReleaseDate { get; set; }
    }
}