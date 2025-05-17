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

        var lowerTerm = term.ToLower();

        var albums = await _context.MusicAlbum
            .Include(a => a.MusicArtistAlbums)
                .ThenInclude(aa => aa.MusicArtist)
            .Where(a =>
                a.Title.ToLower().Contains(lowerTerm) ||
                a.MusicArtistAlbums.Any(aa => aa.MusicArtist.Name.ToLower().Contains(lowerTerm))
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
            })
            .ToListAsync();

        var artists = await _context.MusicArtist
     .Include(ar => ar.MusicArtistAlbums)
         .ThenInclude(aa => aa.MusicAlbum)
     .Include(ar => ar.MusicArtistPhotos)
     .Where(ar => ar.Name.ToLower().Contains(lowerTerm))
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
     })
     .ToListAsync();

        var tracks = await _context.MusicTrack
     .Include(t => t.MusicArtistTrack)
         .ThenInclude(at => at.MusicArtist)
     .Where(t =>
         t.Title.ToLower().Contains(lowerTerm) ||
         t.MusicArtistTrack.Any(at => at.MusicArtist.Name.ToLower().Contains(lowerTerm))
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
     })
     .ToListAsync();

        var results = albums.Concat<object>(artists).Concat(tracks);

        return Ok(results);
    }
}