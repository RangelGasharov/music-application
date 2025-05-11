using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MusicApplicationWebAPI.Data;
using MusicApplicationWebAPI.Dtos.MusicAlbum;
using MusicApplicationWebAPI.Dtos.MusicArtist;
using MusicApplicationWebAPI.Dtos.MusicTrack;
using MusicApplicationWebAPI.Interfaces;
using MusicApplicationWebAPI.Models.Entities;
using MusicApplicationWebAPI.Services;
using NAudio.Wave;

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
            .ToListAsync();

            return [.. musicTracks.Select(music_track => new MusicTrackDto
            {
                Id = music_track.Id,
                Title = music_track.Title,
                CoverURL = music_track.CoverURL,
                UploadedAt = music_track.UploadedAt,
                ReleaseDate = music_track.ReleaseDate,
                FilePath = music_track.FilePath,
                IsExplicit = music_track.IsExplicit,
                Duration = music_track.Duration,
                MusicArtists = [.. music_track.MusicArtistTrack
                    .Select(music_artist_track => new MusicArtistShortFormDto
                    {
                        Id = music_artist_track.MusicArtist.Id,
                        Name = music_artist_track.MusicArtist.Name
                    })]
            })];
        }

        public async Task<MusicTrackDto?> GetMusicTrackById(Guid id)
        {
            var musicTrack = await _context.MusicTrack
            .Include(music_track => music_track.MusicArtistTrack)
            .ThenInclude(music_artist_track => music_artist_track.MusicArtist)
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
                MusicArtists = musicTrack.MusicArtistTrack
                       .Select(music_artist_track => new MusicArtistShortFormDto
                       {
                           Id = music_artist_track.MusicArtist.Id,
                           Name = music_artist_track.MusicArtist.Name
                       })
                       .ToList()
            };
        }

        public async Task<List<MusicTrackDto>> GetMusicTracksByMusicArtistId(Guid artistId)
        {
            var musicTracks = await _context.MusicTrack
                .Include(mt => mt.MusicArtistTrack)
                    .ThenInclude(mat => mat.MusicArtist)
                .Where(mt => mt.MusicArtistTrack.Any(mat => mat.MusicArtistId == artistId))
                .ToListAsync();

            return musicTracks.Select(music_track => new MusicTrackDto
            {
                Id = music_track.Id,
                Title = music_track.Title,
                CoverURL = music_track.CoverURL,
                UploadedAt = music_track.UploadedAt,
                ReleaseDate = music_track.ReleaseDate,
                FilePath = music_track.FilePath,
                IsExplicit = music_track.IsExplicit,
                Duration = music_track.Duration,
                MusicArtists = music_track.MusicArtistTrack
                    .Select(music_artist_track => new MusicArtistShortFormDto
                    {
                        Id = music_artist_track.MusicArtist.Id,
                        Name = music_artist_track.MusicArtist.Name
                    })
                    .ToList()
            }).ToList();
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