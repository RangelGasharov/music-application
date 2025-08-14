using Microsoft.AspNetCore.Mvc;
using MusicApplicationWebAPI.Dtos.MusicAlbum;
using MusicApplicationWebAPI.Interfaces;
using MusicApplicationWebAPI.Models.Entities;

namespace MusicApplicationWebAPI.Controllers;

[ApiController]
[Route("music-artist")]
public class MusicArtistController : ControllerBase
{
    private readonly IMusicArtistRepository _musicArtistRepository;
    public MusicArtistController(IMusicArtistRepository musicArtistRepository)
    {
        _musicArtistRepository = musicArtistRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllMusicArtists()
    {
        var musicArtists = await _musicArtistRepository.GetAllMusicArtists();
        return Ok(musicArtists);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult> GetMusicArtistById([FromRoute] Guid id)
    {
        var musicArtist = await _musicArtistRepository.GetMusicArtistById(id);

        if (musicArtist is null)
        {
            return NotFound();
        }

        return Ok(musicArtist);
    }

    [HttpPost]
    public async Task<IActionResult> AddMusicArtist(AddMusicArtistDto addMusicArtistDto)
    {
        var musicArtistEntity = new MusicArtist()
        {
            Name = addMusicArtistDto.Name,
            Description = addMusicArtistDto.Description,
            FirstName = addMusicArtistDto.FirstName,
            LastName = addMusicArtistDto.LastName,
            BirthDate = addMusicArtistDto.BirthDate
        };

        await _musicArtistRepository.AddMusicArtist(musicArtistEntity);
        return Ok(musicArtistEntity);
    }

    [HttpPut]
    [Route("{id:guid}")]
    public async Task<IActionResult> UpdateMusicArtist(Guid id, UpdateMusicArtistDto updateMusicArtistDto)
    {
        var musicArtist = await _musicArtistRepository.UpdateMusicArtist(id, updateMusicArtistDto);

        if (musicArtist is null)
        {
            return NotFound();
        }

        return Ok(musicArtist);
    }

    [HttpDelete]
    [Route("{id:guid}")]
    public async Task<IActionResult> DeleteMusicArtist(Guid id)
    {
        var musicArtist = await _musicArtistRepository.DeleteMusicArtist(id);

        if (musicArtist is null)
        {
            return NotFound();
        }

        return NoContent();
    }
}