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

        var albumEntities = await _context.MusicAlbum
            .Include(a => a.MusicArtistAlbums)
                .ThenInclude(aa => aa.MusicArtist)
            .ToListAsync();

        var albums = albumEntities
            .Where(a =>
                a.Title.ToLower().Contains(normalizedTerm) ||
                a.MusicArtistAlbums.Any(aa => aa.MusicArtist.Name.ToLower().Contains(normalizedTerm)) ||
                searchPhrases.Any(p =>
                    a.Title.ToLower().Contains(p) ||
                    a.MusicArtistAlbums.Any(aa => aa.MusicArtist.Name.ToLower().Contains(p))
                )
            )
            .Select(a => new
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

        var artistEntities = await _context.MusicArtist
            .Include(ar => ar.MusicArtistAlbums)
                .ThenInclude(aa => aa.MusicAlbum)
            .Include(ar => ar.MusicArtistPhotos)
            .ToListAsync();

        var artists = artistEntities
            .Where(ar =>
                ar.Name.ToLower().Contains(normalizedTerm) ||
                searchPhrases.Any(p => ar.Name.ToLower().Contains(p))
            )
            .Select(ar => new
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

        var trackEntities = await _context.MusicTrack
            .Include(t => t.MusicArtistTrack)
                .ThenInclude(at => at.MusicArtist)
            .ToListAsync();

        var tracks = trackEntities
            .Where(t =>
                t.Title.ToLower().Contains(normalizedTerm) ||
                t.MusicArtistTrack.Any(at => at.MusicArtist.Name.ToLower().Contains(normalizedTerm)) ||
                searchPhrases.Any(p =>
                    t.Title.ToLower().Contains(p) ||
                    t.MusicArtistTrack.Any(at => at.MusicArtist.Name.ToLower().Contains(p))
                )
            )
            .Select(t => new
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
                    }).ToList()
                }
            });

        var results = albums.Concat<object>(artists).Concat(tracks);

        return Ok(results);
    }
}