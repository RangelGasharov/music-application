using Microsoft.EntityFrameworkCore;
using MusicApplicationWebAPI.Data;
using MusicApplicationWebAPI.Dtos;
using MusicApplicationWebAPI.Dtos.MusicAlbum;
using MusicApplicationWebAPI.Dtos.MusicArtist;
using MusicApplicationWebAPI.Dtos.MusicGenre;
using MusicApplicationWebAPI.Dtos.MusicTrack;
using MusicApplicationWebAPI.Interfaces;
using MusicApplicationWebAPI.Models.Entities;

namespace MusicApplicationWebAPI.Repository
{
    public class MusicStreamsRepository : IMusicStreamRepository
    {
        private readonly AppDbContext _context;

        public MusicStreamsRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<MusicStream>> GetAllMusicStreams()
        {
            return await _context.MusicStream
                .ToListAsync();
        }

        public async Task<List<MusicStream>> GetStreamsByMusicArtistId(Guid artistId)
        {
            return await _context.MusicStream
                .Where(ms => ms.MusicTrack.MusicArtistTrack
                    .Any(mat => mat.MusicArtistId == artistId))
                .ToListAsync();
        }

        public async Task<List<MusicStream>> GetStreamsByUserId(Guid userId)
        {
            return await _context.MusicStream
                .Where(ms => ms.UserId == userId)
                .ToListAsync();
        }

        public async Task<List<TopStreamedMusicArtistDto>> GetTopMusicArtistsOfUserThisMonth(Guid userId)
        {
            var now = DateTime.UtcNow;
            var monthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            var nextMonthStart = monthStart.AddMonths(1);

            return await _context.MusicStream
                .Where(ms => ms.UserId == userId
                             && ms.Counted
                             && ms.EndTime >= monthStart
                             && ms.EndTime < nextMonthStart
                             && ms.MusicTrack != null)
                .SelectMany(ms => ms.MusicTrack!.MusicArtistTrack)
                .GroupBy(mat => new { mat.MusicArtistId, mat.MusicArtist!.Name })
                .Select(g => new TopStreamedMusicArtistDto
                {
                    ArtistId = g.Key.MusicArtistId,
                    Name = g.Key.Name,
                    TotalPlays = g.Count()
                })
                .OrderByDescending(x => x.TotalPlays)
                .Take(50)
                .ToListAsync();
        }

        public async Task<List<TopStreamedMusicTrackDto>> GetTopMusicTracksOfUserThisMonth(Guid userId)
        {
            var now = DateTime.UtcNow;
            var monthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            var nextMonthStart = monthStart.AddMonths(1);

            var grouped = await _context.MusicStream
                .Where(ms => ms.UserId == userId
                             && ms.Counted
                             && ms.EndTime >= monthStart
                             && ms.EndTime < nextMonthStart
                             && ms.MusicTrack != null)
                .GroupBy(ms => ms.MusicTrack.Id)
                .Select(g => new
                {
                    MusicTrackId = g.Key,
                    TotalPlays = g.Count()
                })
                .OrderByDescending(x => x.TotalPlays)
                .Take(30)
                .ToListAsync();

            var trackIds = grouped.Select(g => g.MusicTrackId).ToList();

            var tracks = await _context.MusicTrack
                .Where(mt => trackIds.Contains(mt.Id))
                .Include(mt => mt.MusicArtistTrack).ThenInclude(mat => mat.MusicArtist)
                .Include(mt => mt.MusicGenreTrack).ThenInclude(mgt => mgt.MusicGenre)
                .Include(mt => mt.MusicTrackAlbum).ThenInclude(mta => mta.MusicAlbum)
                .Include(mt => mt.MusicTrackStat)
                .ToListAsync();

            var result = grouped
                .Select(g =>
                {
                    var track = tracks.First(t => t.Id == g.MusicTrackId);
                    return new TopStreamedMusicTrackDto
                    {
                        TotalPlays = g.TotalPlays,
                        MusicTrack = new MusicTrackDto
                        {
                            Id = track.Id,
                            Title = track.Title,
                            ReleaseDate = track.ReleaseDate,
                            FilePath = track.FilePath,
                            IsExplicit = track.IsExplicit,
                            UploadedAt = track.UploadedAt,
                            CoverURL = track.CoverURL,
                            Duration = track.Duration,
                            MusicArtists = track.MusicArtistTrack
                                .Select(mat => new MusicArtistShortFormDto
                                {
                                    Id = mat.MusicArtist.Id,
                                    Name = mat.MusicArtist.Name
                                }).ToList(),
                            MusicAlbums = track.MusicTrackAlbum
                                .Select(mta => new MusicAlbumShortFormDto
                                {
                                    Id = mta.MusicAlbum.Id,
                                    Title = mta.MusicAlbum.Title,
                                    CoverURL = mta.MusicAlbum.CoverURL,
                                    UploadedAt = mta.MusicAlbum.UploadedAt,
                                    ReleaseDate = mta.MusicAlbum.ReleaseDate
                                }).ToList(),
                            MusicGenres = track.MusicGenreTrack
                                .Select(mgt => new MusicGenreDto
                                {
                                    Id = mgt.MusicGenre.Id,
                                    Name = mgt.MusicGenre.Name
                                }).ToList(),
                            MusicTrackStat = track.MusicTrackStat == null ? null : new MusicTrackStat
                            {
                                TrackId = track.MusicTrackStat.TrackId,
                                TotalPlays = track.MusicTrackStat.TotalPlays,
                                LastUpdated = track.MusicTrackStat.LastUpdated,
                                AvgDuration = track.MusicTrackStat.AvgDuration,
                                UniqueListeners = track.MusicTrackStat.UniqueListeners
                            }
                        }
                    };
                })
                .ToList();

            return result;
        }

        public async Task<List<TopStreamedMusicTrackDto>> GetTopMusicTracksToday()
        {
            var todayStart = DateTime.UtcNow.Date;
            var tomorrowStart = todayStart.AddDays(1);

            var grouped = await _context.MusicStream
                .Where(ms => ms.Counted
                             && ms.EndTime >= todayStart
                             && ms.EndTime < tomorrowStart
                             && ms.MusicTrack != null)
                .GroupBy(ms => ms.MusicTrack!)
                .Select(g => new
                {
                    MusicTrack = g.Key,
                    TotalPlays = g.Count()
                })
                .OrderByDescending(x => x.TotalPlays)
                .Take(100)
                .ToListAsync();

            return grouped.Select(g => new TopStreamedMusicTrackDto
            {
                TotalPlays = g.TotalPlays,
                MusicTrack = new MusicTrackDto
                {
                    Id = g.MusicTrack.Id,
                    Title = g.MusicTrack.Title,
                    ReleaseDate = g.MusicTrack.ReleaseDate,
                    FilePath = g.MusicTrack.FilePath,
                    IsExplicit = g.MusicTrack.IsExplicit,
                    UploadedAt = g.MusicTrack.UploadedAt,
                    CoverURL = g.MusicTrack.CoverURL,
                    Duration = g.MusicTrack.Duration,

                    MusicArtists = g.MusicTrack.MusicArtistTrack
                        .Select(mat => new MusicArtistShortFormDto
                        {
                            Id = mat.MusicArtist.Id,
                            Name = mat.MusicArtist.Name
                        }).ToList(),

                    MusicAlbums = g.MusicTrack.MusicTrackAlbum
                        .Select(mta => new MusicAlbumShortFormDto
                        {
                            Id = mta.MusicAlbum.Id,
                            Title = mta.MusicAlbum.Title,
                            CoverURL = mta.MusicAlbum.CoverURL,
                            UploadedAt = mta.MusicAlbum.UploadedAt,
                            ReleaseDate = mta.MusicAlbum.ReleaseDate
                        }).ToList(),

                    MusicGenres = g.MusicTrack.MusicGenreTrack
                        .Select(mgt => new MusicGenreDto
                        {
                            Id = mgt.MusicGenre.Id,
                            Name = mgt.MusicGenre.Name
                        }).ToList(),

                    MusicTrackStat = g.MusicTrack.MusicTrackStat
                }
            }).ToList();
        }

        public async Task<List<TopStreamedMusicAlbumDto>> GetTopMusicAlbumsToday()
        {
            var todayStart = DateTime.UtcNow.Date;
            var tomorrowStart = todayStart.AddDays(1);

            return await _context.MusicStream
                .Where(ms => ms.Counted
                             && ms.EndTime >= todayStart
                             && ms.EndTime < tomorrowStart
                             && ms.MusicTrack != null)
                .SelectMany(ms => ms.MusicTrack!.MusicTrackAlbum)
                .GroupBy(mat => new { mat.MusicAlbumId, mat.MusicAlbum!.Title })
                .Select(g => new TopStreamedMusicAlbumDto
                {
                    AlbumId = g.Key.MusicAlbumId,
                    Title = g.Key.Title,
                    TotalPlays = g.Count()
                })
                .OrderByDescending(x => x.TotalPlays)
                .Take(100)
                .ToListAsync();
        }

        public async Task<List<TopStreamedMusicTrackDto>> GetTopMusicTracksOfMusicArtist(Guid artistId)
        {
            var since = DateTime.UtcNow.AddDays(-30);

            var grouped = await _context.MusicStream
                .Where(ms => ms.Counted
                             && ms.EndTime >= since
                             && ms.MusicTrack != null
                             && ms.MusicTrack.MusicArtistTrack.Any(mat => mat.MusicArtistId == artistId))
                .GroupBy(ms => ms.MusicTrack.Id)
                .Select(g => new
                {
                    MusicTrackId = g.Key,
                    TotalPlays = g.Count()
                })
                .OrderByDescending(x => x.TotalPlays)
                .Take(5)
                .ToListAsync();

            var trackIds = grouped.Select(g => g.MusicTrackId).ToList();

            var tracks = await _context.MusicTrack
                .Where(mt => trackIds.Contains(mt.Id))
                .Include(mt => mt.MusicArtistTrack).ThenInclude(mat => mat.MusicArtist)
                .Include(mt => mt.MusicGenreTrack).ThenInclude(mgt => mgt.MusicGenre)
                .Include(mt => mt.MusicTrackAlbum).ThenInclude(mta => mta.MusicAlbum)
                .Include(mt => mt.MusicTrackStat)
                .ToListAsync();

            var result = grouped
                .Select(g =>
                {
                    var track = tracks.First(t => t.Id == g.MusicTrackId);
                    return new TopStreamedMusicTrackDto
                    {
                        TotalPlays = g.TotalPlays,
                        MusicTrack = new MusicTrackDto
                        {
                            Id = track.Id,
                            Title = track.Title,
                            ReleaseDate = track.ReleaseDate,
                            FilePath = track.FilePath,
                            IsExplicit = track.IsExplicit,
                            UploadedAt = track.UploadedAt,
                            CoverURL = track.CoverURL,
                            Duration = track.Duration,
                            MusicArtists = track.MusicArtistTrack
                                .Select(mat => new MusicArtistShortFormDto
                                {
                                    Id = mat.MusicArtist.Id,
                                    Name = mat.MusicArtist.Name
                                }).ToList(),
                            MusicAlbums = track.MusicTrackAlbum
                                .Select(mta => new MusicAlbumShortFormDto
                                {
                                    Id = mta.MusicAlbum.Id,
                                    Title = mta.MusicAlbum.Title,
                                    CoverURL = mta.MusicAlbum.CoverURL,
                                    UploadedAt = mta.MusicAlbum.UploadedAt,
                                    ReleaseDate = mta.MusicAlbum.ReleaseDate
                                }).ToList(),
                            MusicGenres = track.MusicGenreTrack
                                .Select(mgt => new MusicGenreDto
                                {
                                    Id = mgt.MusicGenre.Id,
                                    Name = mgt.MusicGenre.Name
                                }).ToList(),
                            MusicTrackStat = track.MusicTrackStat == null ? null : new MusicTrackStat
                            {
                                TrackId = track.MusicTrackStat.TrackId,
                                TotalPlays = track.MusicTrackStat.TotalPlays,
                                LastUpdated = track.MusicTrackStat.LastUpdated,
                                AvgDuration = track.MusicTrackStat.AvgDuration,
                                UniqueListeners = track.MusicTrackStat.UniqueListeners
                            }
                        }
                    };
                })
                .ToList();

            return result;
        }

        public async Task<MusicStream> StartStream(Guid userId, Guid trackId)
        {
            var musicStream = new MusicStream
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                TrackId = trackId,
                StartTime = DateTime.UtcNow,
                Counted = false
            };

            await _context.MusicStream.AddAsync(musicStream);
            await _context.SaveChangesAsync();
            return musicStream;
        }

        public async Task<MusicStream> EndStream(Guid streamId)
        {
            var stream = await _context.MusicStream.FindAsync(streamId);
            if (stream == null)
                throw new Exception("Stream not found");

            stream.EndTime = DateTime.UtcNow;
            stream.Duration = stream.EndTime - stream.StartTime;

            bool enoughTimePlayed = stream.Duration.HasValue &&
                                    stream.Duration.Value >= TimeSpan.FromSeconds(30);

            var cooldownCutoff = DateTime.UtcNow.AddMinutes(-10);
            bool passedCooldown = !await _context.MusicStream.AnyAsync(s =>
                s.UserId == stream.UserId &&
                s.TrackId == stream.TrackId &&
                s.Counted &&
                s.EndTime != null &&
                s.EndTime >= cooldownCutoff
            );

            var dayStartUtc = DateTime.UtcNow.Date;
            var nextDayStartUtc = dayStartUtc.AddDays(1);

            int playsToday = await _context.MusicStream.CountAsync(s =>
                s.UserId == stream.UserId &&
                s.TrackId == stream.TrackId &&
                s.Counted &&
                s.EndTime != null &&
                s.EndTime >= dayStartUtc &&
                s.EndTime < nextDayStartUtc
            );

            bool underDailyLimit = playsToday < 50;

            stream.Counted = enoughTimePlayed && passedCooldown && underDailyLimit;

            await _context.SaveChangesAsync();
            return stream;
        }
    }
}
