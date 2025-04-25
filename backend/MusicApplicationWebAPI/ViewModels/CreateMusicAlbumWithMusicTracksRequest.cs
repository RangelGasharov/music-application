using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MusicApplicationWebAPI.Dtos.MusicAlbum;
using MusicApplicationWebAPI.Dtos.MusicTrack;

namespace MusicApplicationWebAPI.ViewModels
{
    public class CreateMusicAlbumWithMusicTracksRequest
    {
        public required string Title { get; set; }
        public required DateTime ReleaseDate { get; set; }
        public required List<AddMusicTrackDto> Tracks { get; set; }
    }
}