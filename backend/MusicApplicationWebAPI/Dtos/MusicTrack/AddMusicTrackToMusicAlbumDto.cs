using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicApplicationWebAPI.Dtos.MusicTrack
{
    public class AddMusicTrackToMusicAlbumDto
    {
        public required string Title { get; set; }
        public required DateTime ReleaseDate { get; set; }
        public required bool IsExplicit { get; set; }
        public IFormFile? CoverImage { get; set; }
        public required IFormFile AudioFile { get; set; }
        public int Order { get; set; }
    }
}