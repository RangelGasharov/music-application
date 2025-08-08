using System;
using System.Collections.Generic;
using MusicApplicationWebAPI.Dtos.MusicTrack;

namespace MusicApplicationWebAPI.Dtos.Playlist
{
    public class PlaylistDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string CoverURL { get; set; } = string.Empty;
        public bool IsPublic { get; set; }

        public List<MusicTrackPlaylistDto> MusicTrackPlaylists { get; set; } = new();
    }

    public class MusicTrackPlaylistDto
    {
        public Guid Id { get; set; }
        public Guid PlayListId { get; set; }
        public Guid TrackId { get; set; }
        public DateTime AddedAt { get; set; }
        public int Position { get; set; }

        public MusicTrackDto MusicTrack { get; set; }
    }
}