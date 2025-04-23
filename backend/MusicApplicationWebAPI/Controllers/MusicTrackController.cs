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

    [HttpPost]
    public async Task<IActionResult> AddMusicTrack(AddMusicTrackDto addMusicTrackDto)
    {
        var musicTrack = await _musicTrackRepository.AddMusicTrack(addMusicTrackDto);
        return Ok(musicTrack);
    }

    [HttpPut("{trackId}")]
    public async Task<IActionResult> UpdateMusicTrack(Guid trackId, [FromForm] UpdateMusicTrackDto updateMusicTrackDto)
    {
        var updated = await _musicTrackRepository.UpdateMusicTrack(trackId, updateMusicTrackDto);
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
