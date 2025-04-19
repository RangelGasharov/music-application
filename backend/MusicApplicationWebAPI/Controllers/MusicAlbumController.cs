using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicApplicationWebAPI.Data;
using MusicApplicationWebAPI.Dtos.MusicAlbum;
using MusicApplicationWebAPI.Interfaces;
using MusicApplicationWebAPI.Models.Entities;

namespace MusicApplicationWebAPI.Controllers;
[ApiController]
[Route("music-album")]
public class MusicAlbumController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMusicAlbumRepository _musicAlbumRepository;

    public MusicAlbumController(AppDbContext dbContext, IMusicAlbumRepository musicAlbumRepository)
    {
        _musicAlbumRepository = musicAlbumRepository;
        _context = dbContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllMusicAlbums()
    {
        var musicAlbums = await _musicAlbumRepository.GetAllMusicAlbums();
        return Ok(musicAlbums);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult> GetMusicAlbumById([FromRoute] Guid id)
    {
        var musicAlbum = await _musicAlbumRepository.GetMusicAlbumById(id);

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

        await _musicAlbumRepository.AddMusicAlbum(musicAlbumEntity);
        return Ok(musicAlbumEntity);
    }

    [HttpPut]
    [Route("{id:guid}")]
    public async Task<IActionResult> UpdateMusicAlbum(Guid id, UpdateMusicAlbumDto updateMusicAlbumDto)
    {
        var musicAlbum = await _musicAlbumRepository.UpdateMusicAlbum(id, updateMusicAlbumDto);

        if (musicAlbum is null)
        {
            return NotFound();
        }

        return Ok(musicAlbum);
    }

    [HttpDelete]
    [Route("{id:guid}")]
    public async Task<IActionResult> DeleteAlbumById(Guid id)
    {
        var musicAlbum = await _musicAlbumRepository.DeleteMusicAlbum(id);

        if (musicAlbum is null)
        {
            return NotFound();
        }

        return NoContent();
    }
}