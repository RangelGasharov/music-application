using Microsoft.EntityFrameworkCore;
using MusicApplicationWebAPI.Data;
using MusicApplicationWebAPI.Dtos.MusicAlbum;
using MusicApplicationWebAPI.Dtos.Playlist;
using MusicApplicationWebAPI.Dtos.MusicTrack;
using MusicApplicationWebAPI.Dtos.MusicArtist;
using MusicApplicationWebAPI.Dtos.MusicGenre;
using MusicApplicationWebAPI.Interfaces;
using MusicApplicationWebAPI.Models.Entities;

namespace MusicApplicationWebAPI.Repository
{
    public class PlaylistRepository : IPlaylistRepository
    {
        private readonly AppDbContext _context;

        public PlaylistRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<PlaylistDto>> GetAllPlaylists()
        {
            var playlists = await _context.Playlist
                .Include(p => p.MusicTrackPlaylists)
                    .ThenInclude(mtp => mtp.MusicTrack)
                        .ThenInclude(mt => mt.MusicArtistTrack)
                            .ThenInclude(mat => mat.MusicArtist)
                .Include(p => p.MusicTrackPlaylists)
                    .ThenInclude(mtp => mtp.MusicTrack)
                        .ThenInclude(mt => mt.MusicTrackAlbum)
                            .ThenInclude(mta => mta.MusicAlbum)
                .Include(p => p.MusicTrackPlaylists)
                    .ThenInclude(mtp => mtp.MusicTrack)
                        .ThenInclude(mt => mt.MusicGenreTrack)
                            .ThenInclude(mgt => mgt.MusicGenre)
                .ToListAsync();

            return playlists.Select(playlist => new PlaylistDto
            {
                Id = playlist.Id,
                UserId = playlist.UserId,
                Title = playlist.Title,
                Description = playlist.Description,
                CreatedAt = playlist.CreatedAt,
                UpdatedAt = playlist.UpdatedAt,
                CoverURL = playlist.CoverURL,
                IsPublic = playlist.IsPublic,
                MusicTrackPlaylists = playlist.MusicTrackPlaylists
                    .OrderBy(mtp => mtp.Position)
                    .Select(mtp => new MusicTrackPlaylistDto
                    {
                        Id = mtp.Id,
                        PlayListId = mtp.PlayListId,
                        TrackId = mtp.TrackId,
                        AddedAt = mtp.AddedAt,
                        Position = mtp.Position,
                        MusicTrack = new MusicTrackDto
                        {
                            Id = mtp.MusicTrack.Id,
                            Title = mtp.MusicTrack.Title,
                            ReleaseDate = mtp.MusicTrack.ReleaseDate,
                            FilePath = mtp.MusicTrack.FilePath,
                            IsExplicit = mtp.MusicTrack.IsExplicit,
                            UploadedAt = mtp.MusicTrack.UploadedAt,
                            CoverURL = mtp.MusicTrack.CoverURL,
                            Duration = mtp.MusicTrack.Duration,
                            MusicArtists = mtp.MusicTrack.MusicArtistTrack
                                .Select(mat => new MusicArtistShortFormDto
                                {
                                    Id = mat.MusicArtist.Id,
                                    Name = mat.MusicArtist.Name
                                }).ToList(),
                            MusicAlbums = mtp.MusicTrack.MusicTrackAlbum
                                .Select(mta => new MusicAlbumShortFormDto
                                {
                                    Id = mta.MusicAlbum.Id,
                                    Title = mta.MusicAlbum.Title,
                                    CoverURL = mta.MusicAlbum.CoverURL,
                                    UploadedAt = mta.MusicAlbum.UploadedAt,
                                    ReleaseDate = mta.MusicAlbum.ReleaseDate
                                }).ToList(),
                            MusicGenres = mtp.MusicTrack.MusicGenreTrack
                                .Select(mgt => new MusicGenreDto
                                {
                                    Id = mgt.MusicGenre.Id,
                                    Name = mgt.MusicGenre.Name
                                }).ToList()
                        }
                    }).ToList()
            }).ToList();
        }

        public async Task<PlaylistDto?> GetPlaylistById(Guid id)
        {
            var playlist = await _context.Playlist
                .Where(p => p.Id == id)
                .Include(p => p.MusicTrackPlaylists)
                    .ThenInclude(mtp => mtp.MusicTrack)
                        .ThenInclude(mt => mt.MusicArtistTrack)
                            .ThenInclude(mat => mat.MusicArtist)
                .Include(p => p.MusicTrackPlaylists)
                    .ThenInclude(mtp => mtp.MusicTrack)
                        .ThenInclude(mt => mt.MusicTrackAlbum)
                            .ThenInclude(mta => mta.MusicAlbum)
                .Include(p => p.MusicTrackPlaylists)
                    .ThenInclude(mtp => mtp.MusicTrack)
                        .ThenInclude(mt => mt.MusicGenreTrack)
                            .ThenInclude(mgt => mgt.MusicGenre)
                .FirstOrDefaultAsync();

            if (playlist == null)
                return null;

            return new PlaylistDto
            {
                Id = playlist.Id,
                UserId = playlist.UserId,
                Title = playlist.Title,
                Description = playlist.Description,
                CreatedAt = playlist.CreatedAt,
                UpdatedAt = playlist.UpdatedAt,
                CoverURL = playlist.CoverURL,
                IsPublic = playlist.IsPublic,
                MusicTrackPlaylists = playlist.MusicTrackPlaylists
                    .OrderBy(mtp => mtp.Position)
                    .Select(mtp => new MusicTrackPlaylistDto
                    {
                        Id = mtp.Id,
                        PlayListId = mtp.PlayListId,
                        TrackId = mtp.TrackId,
                        AddedAt = mtp.AddedAt,
                        Position = mtp.Position,
                        MusicTrack = new MusicTrackDto
                        {
                            Id = mtp.MusicTrack.Id,
                            Title = mtp.MusicTrack.Title,
                            ReleaseDate = mtp.MusicTrack.ReleaseDate,
                            FilePath = mtp.MusicTrack.FilePath,
                            IsExplicit = mtp.MusicTrack.IsExplicit,
                            UploadedAt = mtp.MusicTrack.UploadedAt,
                            CoverURL = mtp.MusicTrack.CoverURL,
                            Duration = mtp.MusicTrack.Duration,
                            MusicArtists = mtp.MusicTrack.MusicArtistTrack
                                .Select(mat => new MusicArtistShortFormDto
                                {
                                    Id = mat.MusicArtist.Id,
                                    Name = mat.MusicArtist.Name
                                }).ToList(),
                            MusicAlbums = mtp.MusicTrack.MusicTrackAlbum
                                .Select(mta => new MusicAlbumShortFormDto
                                {
                                    Id = mta.MusicAlbum.Id,
                                    Title = mta.MusicAlbum.Title,
                                    CoverURL = mta.MusicAlbum.CoverURL,
                                    UploadedAt = mta.MusicAlbum.UploadedAt,
                                    ReleaseDate = mta.MusicAlbum.ReleaseDate
                                }).ToList(),
                            MusicGenres = mtp.MusicTrack.MusicGenreTrack
                                .Select(mgt => new MusicGenreDto
                                {
                                    Id = mgt.MusicGenre.Id,
                                    Name = mgt.MusicGenre.Name
                                }).ToList()
                        }
                    }).ToList()
            };
        }

        public async Task<Playlist> AddPlaylist(AddPlaylistDto addPlaylistDto)
        {
            var playlist = new Playlist
            {
                Id = Guid.NewGuid(),
                UserId = addPlaylistDto.UserId,
                Title = addPlaylistDto.Title,
                Description = addPlaylistDto.Description,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                IsPublic = addPlaylistDto.IsPublic
            };

            await _context.Playlist.AddAsync(playlist);
            await _context.SaveChangesAsync();
            return playlist;
        }

        public async Task<Playlist?> UpdatePlaylist(Guid id, Playlist updatedPlaylist)
        {
            var existingPlaylist = await _context.Playlist.FindAsync(id);
            if (existingPlaylist == null)
            {
                return null;
            }

            existingPlaylist.Title = updatedPlaylist.Title;
            existingPlaylist.Description = updatedPlaylist.Description;
            existingPlaylist.CoverURL = updatedPlaylist.CoverURL;
            existingPlaylist.IsPublic = updatedPlaylist.IsPublic;
            existingPlaylist.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existingPlaylist;
        }
        public async Task<Playlist?> DeletePlaylist(Guid id)
        {
            var playlist = await _context.Playlist.FindAsync(id);
            if (playlist == null)
            {
                return null;
            }

            _context.Playlist.Remove(playlist);
            await _context.SaveChangesAsync();
            return playlist;
        }

        public async Task<Playlist> AddPlaylist(AddMusicAlbumDto addMusicAlbumDto)
        {
            throw new NotImplementedException();
        }

        public async Task<Playlist?> UpdatePlaylist(Guid id, UpdateMusicAlbumDto musicAlbumDto)
        {
            throw new NotImplementedException();
        }

        public async Task<List<Playlist>> GetPlaylistsByUserId(Guid userId)
        {
            return await _context.Playlist
                .Where(p => p.UserId == userId)
                .Include(p => p.MusicTrackPlaylists)
                    .ThenInclude(mtp => mtp.MusicTrack)
                .ToListAsync();
        }
        public async Task<Playlist> AddPlaylistWithTracks(AddPlaylistWithMusicTracksDto dto)
        {
            var playlist = new Playlist
            {
                Id = Guid.NewGuid(),
                Title = dto.Title,
                Description = dto.Description,
                UserId = dto.UserId,
                CreatedAt = dto.CreatedAt,
                UpdatedAt = dto.UpdatedAt,
                IsPublic = dto.IsPublic,
                CoverURL = string.Empty
            };

            _context.Playlist.Add(playlist);

            var existingPositions = new HashSet<int>();

            foreach (var musicTrackDto in dto.MusicTracks)
            {
                if (!existingPositions.Add(musicTrackDto.Position))
                {
                    throw new InvalidOperationException($"Duplicate position in playlist: {musicTrackDto.Position}");
                }

                var musicTrack = await _context.MusicTrack.FindAsync(musicTrackDto.TrackId);
                if (musicTrack == null)
                {
                    throw new KeyNotFoundException($"Track with ID {musicTrackDto.TrackId} could not be found.");
                }

                var musicTrackPlaylist = new MusicTrackPlaylist
                {
                    Id = Guid.NewGuid(),
                    PlayListId = playlist.Id,
                    TrackId = musicTrack.Id,
                    Playlist = playlist,
                    MusicTrack = musicTrack,
                    Position = musicTrackDto.Position,
                    AddedAt = dto.CreatedAt
                };

                _context.MusicTrackPlaylist.Add(musicTrackPlaylist);
            }

            await _context.SaveChangesAsync();
            return playlist;
        }
    }
}