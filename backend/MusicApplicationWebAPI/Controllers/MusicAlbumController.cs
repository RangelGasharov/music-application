using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicApplicationWebAPI.Data;
using MusicApplicationWebAPI.Dtos.MusicAlbum;
using MusicApplicationWebAPI.Models.Entities;

namespace MusicApplicationWebAPI.Controllers;
[ApiController]
[Route("music-album")]
public class MusicAlbumController : ControllerBase
{
    private readonly AppDbContext _context;

    public MusicAlbumController(AppDbContext dbContext)
    {
        this._context = dbContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllMusicAlbums()
    {
        var musicAlbums = await _context.MusicAlbum.ToListAsync();
        return Ok(musicAlbums);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult> GetMusicAlbumById([FromRoute] Guid id)
    {
        var musicAlbum = await _context.MusicAlbum.FindAsync(id);
        if (musicAlbum is null)
        {
            return NotFound();
        }
        return Ok(musicAlbum);
    }

    [HttpPost]
    public async Task<IActionResult> AddMusicAlbum(AddMusicAlbumDto addMusicAlbumDto)
    {
        var musicAlbumEntity = new MusicAlbum()
        {
            Title = addMusicAlbumDto.Title,
            CoverURL = addMusicAlbumDto.CoverURL,
            UploadedAt = addMusicAlbumDto.UploadedAt,
            ReleaseDate = addMusicAlbumDto.ReleaseDate
        };

        await _context.MusicAlbum.AddAsync(musicAlbumEntity);
        await _context.SaveChangesAsync();

        return Ok(musicAlbumEntity);
    }

    [HttpPut]
    [Route("{id:guid}")]
    public async Task<IActionResult> UpdateMusicAlbum(Guid id, UpdateMusicAlbumDto updateMusicAlbumDto)
    {
        var musicAlbum = await _context.MusicAlbum.FindAsync(id);

        if (musicAlbum is null)
        {
            return NotFound();
        }

        musicAlbum.Title = updateMusicAlbumDto.Title;
        musicAlbum.CoverURL = updateMusicAlbumDto.CoverURL;
        musicAlbum.UploadedAt = updateMusicAlbumDto.UploadedAt;
        musicAlbum.ReleaseDate = updateMusicAlbumDto.ReleaseDate;

        await _context.SaveChangesAsync();
        return Ok(musicAlbum);
    }

    [HttpDelete]
    [Route("{id:guid}")]
    public async Task<IActionResult> DeleteAlbumById(Guid id)
    {
        var musicAlbum = await _context.MusicAlbum.FindAsync(id);
        if (musicAlbum is null)
        {
            return NotFound();
        }

        _context.MusicAlbum.Remove(musicAlbum);
        await _context.SaveChangesAsync();
        return Ok();
    }
}