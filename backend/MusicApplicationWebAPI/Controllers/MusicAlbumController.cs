using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicApplicationWebAPI.Dtos;
using MusicApplicationWebAPI.Dtos.MusicAlbum;
using MusicApplicationWebAPI.Interfaces;
using MusicApplicationWebAPI.Models.Entities;
using MusicApplicationWebAPI.Services;

namespace MusicApplicationWebAPI.Controllers;
[ApiController]
[Route("music-album")]
public class MusicAlbumController : ControllerBase
{
    private readonly IMusicAlbumRepository _musicAlbumRepository;
    private readonly MinioFileService _minioFileService;

    public MusicAlbumController(IMusicAlbumRepository musicAlbumRepository, MinioFileService minioFileService)
    {
        _musicAlbumRepository = musicAlbumRepository;
        _minioFileService = minioFileService;
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
    public async Task<IActionResult> DeleteMusicAlbumById(Guid id)
    {
        var musicAlbum = await _musicAlbumRepository.DeleteMusicAlbum(id);

        if (musicAlbum is null)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpGet("cover/{albumId}")]
    public async Task<IActionResult> GetCover(Guid albumId)
    {
        var objectName = $"cover/album/{albumId}/{albumId}.jpg";
        var stream = await _minioFileService.GetImageStreamAsync("music-application", objectName);

        if (stream == null)
            return NotFound("Bild nicht gefunden.");

        return File(stream, "image/jpeg");
    }
}