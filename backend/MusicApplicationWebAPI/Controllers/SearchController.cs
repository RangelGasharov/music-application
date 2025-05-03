using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicApplicationWebAPI.Data;

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
            .Where(a => a.Title.ToLower().Contains(lowerTerm))
            .Select(a => new { Type = "Music Album", a.Id, a.Title })
            .ToListAsync();

        var artists = await _context.MusicArtist
            .Where(ar => ar.Name.ToLower().Contains(lowerTerm))
            .Select(ar => new { Type = "Music Artist", ar.Id, Name = ar.Name })
            .ToListAsync();

        var tracks = await _context.MusicTrack
            .Where(t => t.Title.ToLower().Contains(lowerTerm))
            .Select(t => new { Type = "Music Track", t.Id, t.Title })
            .ToListAsync();

        var results = albums.Concat<object>(artists).Concat(tracks);

        return Ok(results);
    }
}