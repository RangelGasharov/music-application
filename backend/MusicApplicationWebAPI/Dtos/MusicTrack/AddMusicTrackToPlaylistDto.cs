using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicApplicationWebAPI.Dtos.MusicTrack
{
    public class AddMusicTrackToPlaylistDto
    {
        public required Guid TrackId { get; set; }
        public int Position { get; set; }
        public required DateTime AddedAt { get; set; }
    }
}