using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MusicApplicationWebAPI.Dtos.MusicAlbum;
using MusicApplicationWebAPI.Interfaces;
using MusicApplicationWebAPI.Models.Entities;
using MusicApplicationWebAPI.Services;

namespace MusicApplicationWebAPI.Controllers;
[ApiController]
[Route("music-track")]

public class MusicTrackController : ControllerBase
{
    private readonly IMusicTrackRepository _musicTrackRepository;
    private readonly MinioFileService _minioFileService;


    public MusicTrackController(IMusicTrackRepository musicTrackRepository, MinioFileService minioFileService)
    {
        _musicTrackRepository = musicTrackRepository;
        _minioFileService = minioFileService;
    }
    [HttpGet]
    public async Task<IActionResult> GetAllMusicTracks()
    {
        var musicTracks = await _musicTrackRepository.GetAllMusicTracks();
        return Ok(musicTracks);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetMusicTrackById(Guid id)
    {
        var musicTrack = await _musicTrackRepository.GetMusicTrackById(id);
        return Ok(musicTrack);
    }

    [HttpGet("music-artist/{id:guid}")]
    public async Task<IActionResult> GetMusicTrackByMusicArtistId(Guid id)
    {
        var musicTrack = await _musicTrackRepository.GetMusicTracksByMusicArtistId(id);
        return Ok(musicTrack);
    }

    [HttpPost]
    public async Task<IActionResult> AddMusicTrack(AddMusicTrackDto addMusicTrackDto)
    {
        var musicTrack = await _musicTrackRepository.AddMusicTrack(addMusicTrackDto);
        return Ok(musicTrack);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateMusicTrack(Guid id, [FromForm] UpdateMusicTrackDto updateMusicTrackDto)
    {
        var updated = await _musicTrackRepository.UpdateMusicTrack(id, updateMusicTrackDto);
        return updated is not null ? Ok(updated) : NotFound();
    }

    [HttpDelete]
    [Route("{id:guid}")]
    public async Task<IActionResult> DeleteMusicTrackById(Guid id)
    {
        var musicTrack = await _musicTrackRepository.DeleteMusicTrack(id);

        if (musicTrack is null)
        {
            return NotFound();
        }

        return NoContent();
    }
}
