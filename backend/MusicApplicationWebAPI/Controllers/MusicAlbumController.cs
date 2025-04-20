using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicApplicationWebAPI.Dtos;
using MusicApplicationWebAPI.Dtos.MusicAlbum;
using MusicApplicationWebAPI.Interfaces;
using MusicApplicationWebAPI.Models.Entities;

namespace MusicApplicationWebAPI.Controllers;
[ApiController]
[Route("music-album")]
public class MusicAlbumController : ControllerBase
{
    private readonly IMusicAlbumRepository _musicAlbumRepository;

    public MusicAlbumController(IMusicAlbumRepository musicAlbumRepository)
    {
        _musicAlbumRepository = musicAlbumRepository;
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
        var musicAlbumDto = new AddMusicAlbumDto()
        {
            Title = addMusicAlbumDto.Title,
            ReleaseDate = addMusicAlbumDto.ReleaseDate,
            CoverImage = addMusicAlbumDto.CoverImage
        };

        var musicAlbum = await _musicAlbumRepository.AddMusicAlbum(musicAlbumDto);
        return Ok(musicAlbum);
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