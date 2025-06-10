using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MusicApplicationWebAPI.Dtos.MusicAlbum;
using MusicApplicationWebAPI.Models.Entities;
using MusicApplicationWebAPI.Repository;

namespace MusicApplicationWebAPI.Controllers;

[ApiController]
[Route("playlist")]
public class PlaylistController : ControllerBase
{
    private readonly PlaylistRepository _playlistRepository;

    public PlaylistController(PlaylistRepository playlistRepository)
    {
        _playlistRepository = playlistRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllPlaylists()
    {
        var playlists = await _playlistRepository.GetAllPlaylists();
        return Ok(playlists);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetPlaylistById([FromRoute] Guid id)
    {
        var playlist = await _playlistRepository.GetPlaylistById(id);
        if (playlist == null)
            return NotFound();

        return Ok(playlist);
    }

    [HttpPost]
    public async Task<IActionResult> AddPlaylist(AddPlaylistDto addPlaylistDto)
    {
        var playlistDto = new AddPlaylistDto()
        {
            UserId = addPlaylistDto.UserId,
            Title = addPlaylistDto.Title,
            Description = addPlaylistDto.Description,
            IsPublic = addPlaylistDto.IsPublic
        };

        var playlist = await _playlistRepository.AddPlaylist(playlistDto);
        return Ok(playlist);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdatePlaylist([FromRoute] Guid id, [FromBody] Playlist updatedPlaylist)
    {
        var playlist = await _playlistRepository.UpdatePlaylist(id, updatedPlaylist);
        if (playlist == null)
            return NotFound();

        return Ok(playlist);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeletePlaylist([FromRoute] Guid id)
    {
        var deletedPlaylist = await _playlistRepository.DeletePlaylist(id);
        if (deletedPlaylist == null)
            return NotFound();

        return NoContent();
    }

    [HttpGet("user-id/{id:guid}")]
    public async Task<ActionResult> GetPlaylistsByUserId([FromRoute] Guid id)
    {
        var playlists = await _playlistRepository.GetPlaylistsByUserId(id);

        if (playlists is null)
        {
            return NotFound();
        }

        return Ok(playlists);
    }


    [HttpPost("with-tracks")]
    [Authorize]
    public async Task<IActionResult> AddPlaylistWithTracks([FromForm] AddPlaylistWithMusicTracksDto addPlaylistWithMusicTracksDto)
    {
        if (addPlaylistWithMusicTracksDto == null)
        {
            return BadRequest("Playlist data is invalid.");
        }

        var authHeader = Request.Headers["Authorization"].ToString();
        Console.WriteLine($"Authorization header: {authHeader}");

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized("Invalid user token.");
        }

        addPlaylistWithMusicTracksDto.UserId = userId;

        var playlist = await _playlistRepository.AddPlaylistWithTracks(addPlaylistWithMusicTracksDto);
        return CreatedAtAction(nameof(GetPlaylistById), new { id = playlist.Id }, playlist);
    }
}