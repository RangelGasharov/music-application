using Microsoft.AspNetCore.Mvc;
using MusicApplicationWebAPI.Dtos.MusicAlbum;
using MusicApplicationWebAPI.Interfaces;
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

    [HttpGet("music-artist/{id:guid}")]
    public async Task<ActionResult> GetMusicAlbumByMusicArtistId([FromRoute] Guid id)
    {
        var musicAlbums = await _musicAlbumRepository.GetMusicAlbumsByMusicArtistId(id);

        if (musicAlbums is null)
        {
            return NotFound();
        }

        return Ok(musicAlbums);
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

    [HttpGet("cover/{id:guid}")]
    public async Task<IActionResult> GetCover(Guid id)
    {
        var objectName = $"cover/album/{id}/{id}.jpg";
        var stream = await _minioFileService.GetImageStreamAsync("music-application", objectName);

        if (stream == null)
            return NotFound("Bild nicht gefunden.");

        return File(stream, "image/jpeg");
    }

    [HttpPost("with-tracks")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> AddMusicAlbumWithTracks([FromForm] AddMusicAlbumWithMusicTracksDto addMusicAlbumWithMusicTracksDto)
    {
        if (addMusicAlbumWithMusicTracksDto == null)
        {
            return BadRequest("Album data is invalid.");
        }

        var musicAlbum = await _musicAlbumRepository.AddMusicAlbumWithTracks(addMusicAlbumWithMusicTracksDto);
        return CreatedAtAction(nameof(GetMusicAlbumById), new { id = musicAlbum.Id }, musicAlbum);
    }
}