using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MusicApplicationWebAPI.Dtos.MusicAlbum;
using MusicApplicationWebAPI.Dtos.MusicArtist;
using MusicApplicationWebAPI.Dtos.MusicGenre;
using MusicApplicationWebAPI.Models.Entities;

namespace MusicApplicationWebAPI.Dtos.MusicTrack
{
    public class MusicTrackDto
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public required DateTime ReleaseDate { get; set; }
        public required string FilePath { get; set; }
        public required bool IsExplicit { get; set; }
        public required DateTime UploadedAt { get; set; }
        public required string CoverURL { get; set; }
        public required TimeSpan Duration { get; set; }
        public int? Position { get; set; }
        public List<MusicArtistShortFormDto> MusicArtists { get; set; } = [];
        public List<MusicAlbumShortFormDto> MusicAlbums { get; set; } = [];
        public List<MusicGenreDto> MusicGenres { get; set; } = [];
    }
}