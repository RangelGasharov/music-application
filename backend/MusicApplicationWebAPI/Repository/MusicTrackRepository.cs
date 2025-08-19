using Microsoft.EntityFrameworkCore;
using MusicApplicationWebAPI.Data;
using MusicApplicationWebAPI.Dtos.MusicAlbum;
using MusicApplicationWebAPI.Dtos.MusicArtist;
using MusicApplicationWebAPI.Dtos.MusicGenre;
using MusicApplicationWebAPI.Dtos.MusicTrack;
using MusicApplicationWebAPI.Interfaces;
using MusicApplicationWebAPI.Models.Entities;
using MusicApplicationWebAPI.Services;
using Sprache;

namespace MusicApplicationWebAPI.Repository
{
    public class MusicTrackRepository : IMusicTrackRepository
    {
        private readonly AppDbContext _context;
        private readonly MinioFileService _minioFileService;

        public MusicTrackRepository(AppDbContext dbContext, MinioFileService minioFileService)
        {
            _minioFileService = minioFileService;
            _context = dbContext;
        }
        public async Task<List<MusicTrackDto>> GetAllMusicTracks()
        {
            var musicTracks = await _context.MusicTrack
            .Include(music_track => music_track.MusicArtistTrack)
                .ThenInclude(music_artist_track => music_artist_track.MusicArtist)
            .Include(music_track => music_track.MusicGenreTrack)
                .ThenInclude(mgt => mgt.MusicGenre)
            .Include(music_track => music_track.MusicTrackAlbum)
                .ThenInclude(mta => mta.MusicAlbum)
            .Include(mts => mts.MusicTrackStat)
            .ToListAsync();

            return [.. musicTracks.Select(musicTrack => new MusicTrackDto
            {
                Id = musicTrack.Id,
                Title = musicTrack.Title,
                CoverURL = musicTrack.CoverURL,
                UploadedAt = musicTrack.UploadedAt,
                ReleaseDate = musicTrack.ReleaseDate,
                FilePath = musicTrack.FilePath,
                IsExplicit = musicTrack.IsExplicit,
                Duration = musicTrack.Duration,
                MusicArtists = [.. musicTrack.MusicArtistTrack
                    .Select(music_artist_track => new MusicArtistShortFormDto
                    {
                        Id = music_artist_track.MusicArtist.Id,
                        Name = music_artist_track.MusicArtist.Name
                    })],
                MusicGenres = [.. musicTrack.MusicGenreTrack
                    .Select(mgt => new MusicGenreDto
                    {
                        Id = mgt.MusicGenre.Id,
                        Name = mgt.MusicGenre.Name
                    })],
                MusicAlbums = [.. musicTrack.MusicTrackAlbum
                        .Select(mta => new MusicAlbumShortFormDto
                        {
                            Id = mta.MusicAlbum.Id,
                            Title = mta.MusicAlbum.Title,
                            CoverURL = mta.MusicAlbum.CoverURL,
                            UploadedAt = mta.MusicAlbum.UploadedAt,
                            ReleaseDate = mta.MusicAlbum.ReleaseDate
                    })],
                 MusicTrackStat = musicTrack.MusicTrackStat == null ? null : new MusicTrackStat
                {
                    TrackId = musicTrack.MusicTrackStat.TrackId,
                    TotalPlays = musicTrack.MusicTrackStat.TotalPlays,
                    LastUpdated = musicTrack.MusicTrackStat.LastUpdated,
                    AvgDuration = musicTrack.MusicTrackStat.AvgDuration,
                    UniqueListeners = musicTrack.MusicTrackStat.UniqueListeners
                }
            })];
        }

        public async Task<MusicTrackDto?> GetMusicTrackById(Guid id)
        {
            var musicTrack = await _context.MusicTrack
            .Include(music_track => music_track.MusicArtistTrack)
                .ThenInclude(music_artist_track => music_artist_track.MusicArtist)
            .Include(music_track => music_track.MusicGenreTrack)
                .ThenInclude(mgt => mgt.MusicGenre)
            .Include(music_track => music_track.MusicTrackAlbum)
                .ThenInclude(mta => mta.MusicAlbum)
            .Include(mts => mts.MusicTrackStat)
            .FirstOrDefaultAsync(musicTrack => musicTrack.Id == id);

            if (musicTrack == null)
            {
                return null;
            }
            return new MusicTrackDto
            {
                Id = musicTrack.Id,
                Title = musicTrack.Title,
                CoverURL = musicTrack.CoverURL,
                UploadedAt = musicTrack.UploadedAt,
                ReleaseDate = musicTrack.ReleaseDate,
                FilePath = musicTrack.FilePath,
                IsExplicit = musicTrack.IsExplicit,
                Duration = musicTrack.Duration,
                MusicArtists = [.. musicTrack.MusicArtistTrack
                       .Select(music_artist_track => new MusicArtistShortFormDto
                       {
                           Id = music_artist_track.MusicArtist.Id,
                           Name = music_artist_track.MusicArtist.Name
                       })],
                MusicGenres = [.. musicTrack.MusicGenreTrack
                        .Select(mgt => new MusicGenreDto
                        {
                            Id = mgt.MusicGenre.Id,
                            Name = mgt.MusicGenre.Name
                        })],
                MusicAlbums = [.. musicTrack.MusicTrackAlbum
                        .Select(mta => new MusicAlbumShortFormDto
                        {
                            Id = mta.MusicAlbum.Id,
                            Title = mta.MusicAlbum.Title,
                            CoverURL = mta.MusicAlbum.CoverURL,
                            UploadedAt = mta.MusicAlbum.UploadedAt,
                            ReleaseDate = mta.MusicAlbum.ReleaseDate
                        })],
                MusicTrackStat = musicTrack.MusicTrackStat == null ? null : new MusicTrackStat
                {
                    TrackId = musicTrack.MusicTrackStat.TrackId,
                    TotalPlays = musicTrack.MusicTrackStat.TotalPlays,
                    LastUpdated = musicTrack.MusicTrackStat.LastUpdated,
                    AvgDuration = musicTrack.MusicTrackStat.AvgDuration,
                    UniqueListeners = musicTrack.MusicTrackStat.UniqueListeners
                }
            };
        }

        public async Task<List<MusicTrackDto>> GetMusicTracksByMusicArtistId(Guid artistId)
        {
            var musicTracks = await _context.MusicTrack
                .Include(mt => mt.MusicArtistTrack)
                    .ThenInclude(mat => mat.MusicArtist)
                .Where(mt => mt.MusicArtistTrack.Any(mat => mat.MusicArtistId == artistId))
                .Include(mts => mts.MusicTrackStat)
                .ToListAsync();

            return [.. musicTracks.Select(musicTrack => new MusicTrackDto
            {
                Id = musicTrack.Id,
                Title = musicTrack.Title,
                CoverURL = musicTrack.CoverURL,
                UploadedAt = musicTrack.UploadedAt,
                ReleaseDate = musicTrack.ReleaseDate,
                FilePath = musicTrack.FilePath,
                IsExplicit = musicTrack.IsExplicit,
                Duration = musicTrack.Duration,
                MusicArtists = [.. musicTrack.MusicArtistTrack
                    .Select(music_artist_track => new MusicArtistShortFormDto
                    {
                        Id = music_artist_track.MusicArtist.Id,
                        Name = music_artist_track.MusicArtist.Name
                    })],
                MusicGenres = [.. musicTrack.MusicGenreTrack
                    .Select(mgt => new MusicGenreDto
                    {
                        Id = mgt.MusicGenre.Id,
                        Name = mgt.MusicGenre.Name
                    })],
                MusicAlbums = [.. musicTrack.MusicTrackAlbum
                        .Select(mta => new MusicAlbumShortFormDto
                        {
                            Id = mta.MusicAlbum.Id,
                            Title = mta.MusicAlbum.Title,
                            CoverURL = mta.MusicAlbum.CoverURL,
                            UploadedAt = mta.MusicAlbum.UploadedAt,
                            ReleaseDate = mta.MusicAlbum.ReleaseDate
                    })],
                MusicTrackStat = musicTrack.MusicTrackStat == null ? null : new MusicTrackStat
                {
                    TrackId = musicTrack.MusicTrackStat.TrackId,
                    TotalPlays = musicTrack.MusicTrackStat.TotalPlays,
                    LastUpdated = musicTrack.MusicTrackStat.LastUpdated,
                    AvgDuration = musicTrack.MusicTrackStat.AvgDuration,
                    UniqueListeners = musicTrack.MusicTrackStat.UniqueListeners
                }
            })];
        }

        public async Task<List<MusicTrackWithPositionDto>> GetMusicTracksByMusicAlbumId(Guid albumId)
        {
            var musicTracks = await _context.MusicTrack
                .Include(mt => mt.MusicArtistTrack)
                    .ThenInclude(mat => mat.MusicArtist)
                .Include(mt => mt.MusicTrackAlbum)
                    .ThenInclude(mta => mta.MusicAlbum)
                .Where(mt => mt.MusicTrackAlbum.Any(mta => mta.MusicAlbumId == albumId))
                .Include(mts => mts.MusicTrackStat)
                .ToListAsync();

            var result = musicTracks
                .Select(musicTrack =>
                {
                    var position = musicTrack.MusicTrackAlbum
                        .FirstOrDefault(mta => mta.MusicAlbumId == albumId)?.Position ?? 0;

                    var dto = new MusicTrackDto
                    {
                        Id = musicTrack.Id,
                        Title = musicTrack.Title,
                        CoverURL = musicTrack.CoverURL,
                        UploadedAt = musicTrack.UploadedAt,
                        ReleaseDate = musicTrack.ReleaseDate,
                        FilePath = musicTrack.FilePath,
                        IsExplicit = musicTrack.IsExplicit,
                        Duration = musicTrack.Duration,
                        MusicArtists = [.. musicTrack.MusicArtistTrack
                            .Select(mat => new MusicArtistShortFormDto
                            {
                                Id = mat.MusicArtist.Id,
                                Name = mat.MusicArtist.Name
                            })],
                        MusicAlbums = [.. musicTrack.MusicTrackAlbum
                            .Select(mta => new MusicAlbumShortFormDto
                            {
                                Id = mta.MusicAlbum.Id,
                                Title = mta.MusicAlbum.Title,
                                CoverURL = mta.MusicAlbum.CoverURL,
                                UploadedAt = mta.MusicAlbum.UploadedAt,
                                ReleaseDate = mta.MusicAlbum.ReleaseDate
                            })],
                        MusicTrackStat = musicTrack.MusicTrackStat == null ? null : new MusicTrackStat
                        {
                            TrackId = musicTrack.MusicTrackStat.TrackId,
                            TotalPlays = musicTrack.MusicTrackStat.TotalPlays,
                            LastUpdated = musicTrack.MusicTrackStat.LastUpdated,
                            AvgDuration = musicTrack.MusicTrackStat.AvgDuration,
                            UniqueListeners = musicTrack.MusicTrackStat.UniqueListeners
                        }
                    };

                    return new MusicTrackWithPositionDto
                    {
                        Position = position,
                        Track = dto
                    };
                })
                .OrderBy(pt => (int)pt.Position)
                .ToList();

            return result;
        }

        public async Task<List<MusicTrackWithPositionDto>> GetMusicTracksPlaylistId(Guid playlistId)
        {
            var musicTracks = await _context.MusicTrack
                .Include(mt => mt.MusicTrackPlaylist)
                .Include(mt => mt.MusicArtistTrack)
                    .ThenInclude(mat => mat.MusicArtist)
                .Include(mt => mt.MusicTrackAlbum)
                    .ThenInclude(mta => mta.MusicAlbum)
                .Where(mt => mt.MusicTrackPlaylist.Any(mtp => mtp.PlayListId == playlistId))
                .ToListAsync();

            var result = musicTracks.Select(musicTrack =>
            {
                var position = musicTrack.MusicTrackPlaylist
                    .FirstOrDefault(mtp => mtp.PlayListId == playlistId)?.Position ?? 0;

                var trackDto = new MusicTrackDto
                {
                    Id = musicTrack.Id,
                    Title = musicTrack.Title,
                    CoverURL = musicTrack.CoverURL,
                    UploadedAt = musicTrack.UploadedAt,
                    ReleaseDate = musicTrack.ReleaseDate,
                    FilePath = musicTrack.FilePath,
                    IsExplicit = musicTrack.IsExplicit,
                    Duration = musicTrack.Duration,
                    MusicArtists = musicTrack.MusicArtistTrack
                        .Select(mat => new MusicArtistShortFormDto
                        {
                            Id = mat.MusicArtist.Id,
                            Name = mat.MusicArtist.Name
                        })
                        .ToList(),
                    MusicAlbums = musicTrack.MusicTrackAlbum
                        .Select(mta => new MusicAlbumShortFormDto
                        {
                            Id = mta.MusicAlbum.Id,
                            Title = mta.MusicAlbum.Title,
                            CoverURL = mta.MusicAlbum.CoverURL,
                            UploadedAt = mta.MusicAlbum.UploadedAt,
                            ReleaseDate = mta.MusicAlbum.ReleaseDate
                        })
                        .ToList()
                };

                return new MusicTrackWithPositionDto
                {
                    Position = position,
                    Track = trackDto
                };
            })
            .OrderBy(pt => (int)pt.Position)
            .ToList();

            return result;
        }

        public async Task<MusicTrack> AddMusicTrack(AddMusicTrackDto addMusicTrackDto)
        {
            var trackId = Guid.NewGuid();

            var musicTrack = new MusicTrack
            {
                Id = trackId,
                Title = addMusicTrackDto.Title,
                IsExplicit = addMusicTrackDto.IsExplicit,
                ReleaseDate = DateTime.SpecifyKind(addMusicTrackDto.ReleaseDate, DateTimeKind.Utc),
                CoverURL = "",
                FilePath = "",
                UploadedAt = DateTime.UtcNow,
                Duration = TimeSpan.Zero
            };

            if (addMusicTrackDto.AudioFile != null)
            {
                var audioUrl = await _minioFileService.UploadAudioFileAsync(trackId, addMusicTrackDto.AudioFile);
                musicTrack.FilePath = audioUrl;

                var duration = await _minioFileService.GetAudioDurationAsync(addMusicTrackDto.AudioFile);
                musicTrack.Duration = duration;
            }

            if (addMusicTrackDto.CoverImage != null)
            {
                var coverUrl = await _minioFileService.UploadMusicTrackCoverAsync(trackId, addMusicTrackDto.CoverImage);
                musicTrack.CoverURL = coverUrl;
            }

            await _context.MusicTrack.AddAsync(musicTrack);
            await _context.SaveChangesAsync();

            return musicTrack;
        }

        public async Task<MusicTrack?> UpdateMusicTrack(Guid musicTrackId, UpdateMusicTrackDto updateMusicTrackDto)
        {
            var musicTrack = await _context.MusicTrack.FindAsync(musicTrackId);
            if (musicTrack == null)
                return null;

            if (!string.IsNullOrWhiteSpace(updateMusicTrackDto.Title))
                musicTrack.Title = updateMusicTrackDto.Title;

            if (updateMusicTrackDto.ReleaseDate.HasValue)
                musicTrack.ReleaseDate = updateMusicTrackDto.ReleaseDate.Value;

            if (updateMusicTrackDto.IsExplicit.HasValue)
                musicTrack.IsExplicit = updateMusicTrackDto.IsExplicit.Value;

            if (updateMusicTrackDto.AudioFile != null)
            {
                await _minioFileService.DeleteMusicTrackAudioAsync(musicTrackId);
                var audioUrl = await _minioFileService.UploadAudioFileAsync(musicTrackId, updateMusicTrackDto.AudioFile);
                musicTrack.FilePath = audioUrl;
                musicTrack.Duration = await _minioFileService.GetAudioDurationAsync(updateMusicTrackDto.AudioFile);
            }

            if (updateMusicTrackDto.CoverImage != null)
            {
                await _minioFileService.DeleteMusicTrackCoverAsync(musicTrackId);
                var coverUrl = await _minioFileService.UploadMusicTrackCoverAsync(musicTrackId, updateMusicTrackDto.CoverImage);
                musicTrack.CoverURL = coverUrl;
            }

            await _context.SaveChangesAsync();
            return musicTrack;
        }

        public async Task<MusicTrack?> DeleteMusicTrack(Guid id)
        {
            var musicTrack = await _context.MusicTrack.FindAsync(id);
            if (musicTrack is null)
            {
                return null;
            }

            await _minioFileService.DeleteMusicTrackAudioAsync(musicTrack.Id);
            await _minioFileService.DeleteMusicTrackCoverAsync(musicTrack.Id);

            _context.MusicTrack.Remove(musicTrack);
            await _context.SaveChangesAsync();

            return musicTrack;
        }
    }
}