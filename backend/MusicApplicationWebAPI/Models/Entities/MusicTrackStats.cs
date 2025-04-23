using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicApplicationWebAPI.Models.Entities
{
    public class MusicTrackStats
    {
        public Guid TrackId { get; set; }
        public required MusicTrack MusicTrack { get; set; }
        public int TotalPlays { get; set; }
        public DateTime LastUpdated { get; set; }
        public TimeSpan AvgDuration { get; set; }
        public int UniqueListeners { get; set; }
    }
}