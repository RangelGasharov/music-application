using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicApplicationWebAPI.Data;
using MusicApplicationWebAPI.Dtos;
using MusicApplicationWebAPI.Dtos.MusicAlbum;
using MusicApplicationWebAPI.Dtos.MusicArtist;
using MusicApplicationWebAPI.Dtos.MusicTrack;

namespace MusicApplicationWebAPI.Controllers;

[ApiController]
[Route("search")]
public class SearchController : Controller
{
    private readonly AppDbContext _context;

    public SearchController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Search([FromQuery] string term)
    {
        if (string.IsNullOrWhiteSpace(term))
            return BadRequest("Search term is required.");

        var normalizedTerm = term.Trim().ToLower();

        var searchPhrases = normalizedTerm
            .Split(' ', StringSplitOptions.RemoveEmptyEntries)
            .Where(p => p.Length >= 2)
            .ToList();

        var prefixes = new[] { "", "the " };
        var allPatterns = searchPhrases
            .Append(normalizedTerm)
            .SelectMany(p => prefixes.Select(prefix => $"{prefix}{p}%"))
            .Distinct()
            .ToList();

        var albumQuery = _context.MusicAlbum
            .Include(a => a.MusicArtistAlbums)
                .ThenInclude(aa => aa.MusicArtist)
            .Where(a =>
                allPatterns.Any(pattern => EF.Functions.Like(a.Title.ToLower(), pattern)) ||
                a.MusicArtistAlbums.Any(aa =>
                    allPatterns.Any(pattern => EF.Functions.Like(aa.MusicArtist.Name.ToLower(), pattern)))
            );

        var albumResults = await albumQuery.ToListAsync();

        var albums = albumResults.Select(a => new
        {
            Type = "Music Album",
            MusicAlbum = new MusicAlbumDto
            {
                Id = a.Id,
                Title = a.Title,
                CoverURL = a.CoverURL,
                UploadedAt = a.UploadedAt,
                ReleaseDate = a.ReleaseDate,
                MusicArtists = a.MusicArtistAlbums.Select(aa => new MusicArtistShortFormDto
                {
                    Id = aa.MusicArtist.Id,
                    Name = aa.MusicArtist.Name
                }).ToList()
            }
        });

        var artistQuery = _context.MusicArtist
            .Include(ar => ar.MusicArtistAlbums)
                .ThenInclude(aa => aa.MusicAlbum)
            .Include(ar => ar.MusicArtistPhotos)
            .Where(ar =>
                allPatterns.Any(pattern => EF.Functions.Like(ar.Name.ToLower(), pattern))
            );

        var artistResults = await artistQuery.ToListAsync();

        var artists = artistResults.Select(ar => new
        {
            Type = "Music Artist",
            MusicArtist = new MusicArtistDto
            {
                Id = ar.Id,
                Name = ar.Name,
                Description = ar.Description,
                FirstName = ar.FirstName,
                LastName = ar.LastName,
                BirthDate = ar.BirthDate,
                MusicAlbums = ar.MusicArtistAlbums
                    .Select(aa => new MusicAlbumShortFormDto
                    {
                        Id = aa.MusicAlbum.Id,
                        Title = aa.MusicAlbum.Title,
                        CoverURL = aa.MusicAlbum.CoverURL,
                        UploadedAt = aa.MusicAlbum.UploadedAt,
                        ReleaseDate = aa.MusicAlbum.ReleaseDate
                    }).ToList(),
                Photos = ar.MusicArtistPhotos
                    .Select(p => new MusicArtistPhotoDto
                    {
                        Id = p.Id,
                        FilePath = p.FilePath,
                        UploadedAt = p.UploadedAt,
                        IsPrimary = p.IsPrimary
                    }).ToList()
            }
        });

        var trackQuery = _context.MusicTrack
            .Include(t => t.MusicArtistTrack)
                .ThenInclude(at => at.MusicArtist)
            .Include(t => t.MusicTrackAlbums)
                .ThenInclude(ta => ta.MusicAlbum)
            .Where(t =>
                allPatterns.Any(pattern => EF.Functions.Like(t.Title.ToLower(), pattern)) ||
                t.MusicArtistTrack.Any(at =>
                    allPatterns.Any(pattern => EF.Functions.Like(at.MusicArtist.Name.ToLower(), pattern)))
            );

        var trackResults = await trackQuery.ToListAsync();

        var tracks = trackResults.Select(t => new
        {
            Type = "Music Track",
            MusicTrack = new MusicTrackDto
            {
                Id = t.Id,
                Title = t.Title,
                ReleaseDate = t.ReleaseDate,
                FilePath = t.FilePath,
                IsExplicit = t.IsExplicit,
                UploadedAt = t.UploadedAt,
                CoverURL = t.CoverURL,
                Duration = t.Duration,
                MusicArtists = t.MusicArtistTrack.Select(at => new MusicArtistShortFormDto
                {
                    Id = at.MusicArtist.Id,
                    Name = at.MusicArtist.Name
                }).ToList(),
                MusicAlbums = t.MusicTrackAlbums
                .Where(ta => ta.MusicAlbum != null)
                .Select(ta => new MusicAlbumShortFormDto
                {
                    Id = ta.MusicAlbum!.Id,
                    Title = ta.MusicAlbum.Title,
                    CoverURL = ta.MusicAlbum.CoverURL,
                    UploadedAt = ta.MusicAlbum.UploadedAt,
                    ReleaseDate = ta.MusicAlbum.ReleaseDate
                }).ToList()
            }
        });

        var results = albums.Concat<object>(artists).Concat(tracks);

        return Ok(results);
    }
}