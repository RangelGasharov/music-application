using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MusicApplicationWebAPI.Dtos.MusicTrack;

namespace MusicApplicationWebAPI.Dtos.MusicAlbum
{
    public class AddPlaylistWithMusicTracksDto
    {
        public required string Title { get; set; }
        public string? Description { get; set; }
        public required Guid UserId { get; set; }
        public required DateTime CreatedAt { get; set; }
        public required DateTime UpdatedAt { get; set; }
        public string? CoverURL { get; set; }
        public required bool IsPublic { get; set; }
        public required List<AddMusicTrackToPlaylistDto> MusicTracks { get; set; }
    }
}