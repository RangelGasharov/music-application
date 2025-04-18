using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicApplicationWebAPI.Data;
using MusicApplicationWebAPI.Models;

namespace MusicApplicationWebAPI.Controllers;
[ApiController]
[Route("music-album")]
public class MusicAlbumController(AppDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MusicAlbum>>> Get()
    {
        var musicAlbums = await dbContext.MusicAlbum.ToListAsync();
        return Ok(musicAlbums);
    }
}