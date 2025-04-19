using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicApplicationWebAPI.Dtos.MusicArtist
{
    public class MusicArtistShortFormDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}