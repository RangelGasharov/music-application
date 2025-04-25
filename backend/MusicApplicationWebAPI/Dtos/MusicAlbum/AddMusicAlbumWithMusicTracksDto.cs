using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MusicApplicationWebAPI.Dtos.MusicTrack;

namespace MusicApplicationWebAPI.Dtos.MusicAlbum
{
    public class AddMusicAlbumWithMusicTracksDto
    {
        public required string Title { get; set; }
        public required DateTime ReleaseDate { get; set; }
        public IFormFile? CoverImage { get; set; }
        public required List<AddMusicTrackToMusicAlbumDto> MusicTracks { get; set; }
    }
}