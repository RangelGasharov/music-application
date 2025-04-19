using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MusicApplicationWebAPI.Dtos.MusicAlbum;

namespace MusicApplicationWebAPI.Dtos.MusicArtist
{
    public class MusicArtistDto
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateTime? BirthDate { get; set; }
        public List<MusicAlbumShortFormDto> MusicAlbums { get; set; } = [];
    }
}