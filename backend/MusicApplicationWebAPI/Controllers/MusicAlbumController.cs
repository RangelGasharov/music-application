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
    private readonly AppDbContext dbContext;

    public MusicAlbumController(AppDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    [HttpGet]
    public IActionResult GetAllMusicAlbums()
    {
        var musicAlbums = dbContext.MusicAlbum.ToList();
        return Ok(musicAlbums);
    }

    [HttpGet("{id:guid}")]
    public IActionResult GetMusicAlbumById([FromRoute] Guid id)
    {
        var musicAlbum = dbContext.MusicAlbum.Find(id);
        if (musicAlbum is null)
        {
            return NotFound();
        }
        return Ok(musicAlbum);
    }

    [HttpPost]
    public IActionResult AddMusicAlbum(AddMusicAlbum addMusicAlbum)
    {
        var musicAlbumEntity = new MusicAlbum()
        {
            Title = addMusicAlbum.Title,
            CoverURL = addMusicAlbum.CoverURL,
            UploadedAt = addMusicAlbum.UploadedAt,
            ReleaseDate = addMusicAlbum.ReleaseDate
        };

        dbContext.MusicAlbum.Add(musicAlbumEntity);
        dbContext.SaveChanges();

        return Ok(musicAlbumEntity);
    }

    [HttpPut]
    [Route("{id:guid}")]
    public IActionResult UpdateMusicAlbum(Guid id, UpdateMusicAlbum updateMusicAlbum)
    {
        var musicAlbum = dbContext.MusicAlbum.Find(id);

        if (musicAlbum is null)
        {
            return NotFound();
        }

        musicAlbum.Title = updateMusicAlbum.Title;
        musicAlbum.CoverURL = updateMusicAlbum.CoverURL;
        musicAlbum.UploadedAt = updateMusicAlbum.UploadedAt;
        musicAlbum.ReleaseDate = updateMusicAlbum.ReleaseDate;

        dbContext.SaveChanges();
        return Ok(musicAlbum);
    }

    [HttpDelete]
    [Route("{id:guid}")]
    public IActionResult DeleteAlbumById(Guid id)
    {
        var musicAlbum = dbContext.MusicAlbum.Find(id);
        if (musicAlbum is null)
        {
            return NotFound();
        }

        dbContext.MusicAlbum.Remove(musicAlbum);
        dbContext.SaveChanges();
        return Ok();
    }
}