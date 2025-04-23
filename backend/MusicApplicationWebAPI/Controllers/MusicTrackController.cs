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
        var musicTrackDto = new AddMusicTrackDto()
        {
            Title = addMusicTrackDto.Title,
            IsExplicit = addMusicTrackDto.IsExplicit,
            ReleaseDate = addMusicTrackDto.ReleaseDate,
            CoverImage = addMusicTrackDto.CoverImage,
            AudioFile = addMusicTrackDto.AudioFile
        };

        var musicTrack = await _musicTrackRepository.AddMusicTrack(addMusicTrackDto);
        return Ok(musicTrack);
    }
}
