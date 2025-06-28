using MusicApplicationWebAPI.Dtos.MusicTrack;
using MusicApplicationWebAPI.Models.Entities;

public class QueueItemWithMusicTrackDto
{
    public Guid Id { get; set; }
    public Guid QueueId { get; set; }
    public Guid TrackId { get; set; }
    public string Position { get; set; } = string.Empty;
    public DateTime AddedAt { get; set; }

    public MusicTrackDto? Track { get; set; }
}