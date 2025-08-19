using System.ComponentModel.DataAnnotations;

namespace MusicApplicationWebAPI.Models.Entities
{
    public class MusicTrackStat
    {
        [Key]
        public Guid TrackId { get; set; }
        public int TotalPlays { get; set; }
        public DateTime LastUpdated { get; set; }
        public TimeSpan AvgDuration { get; set; }
        public int UniqueListeners { get; set; }
        public MusicTrack? MusicTrack { get; set; }
    }
}