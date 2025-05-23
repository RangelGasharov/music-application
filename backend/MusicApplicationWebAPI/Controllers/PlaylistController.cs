using Microsoft.AspNetCore.Mvc;
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
        var playlists = await _playlistRepository.GetAllPlaylistsAsync();
        return Ok(playlists);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetPlaylistById([FromRoute] Guid id)
    {
        var playlist = await _playlistRepository.GetPlaylistByIdAsync(id);
        if (playlist == null)
            return NotFound();

        return Ok(playlist);
    }

    [HttpPost]
    public async Task<IActionResult> AddPlaylist([FromBody] Playlist playlist)
    {
        var createdPlaylist = await _playlistRepository.AddPlaylistAsync(playlist);
        return CreatedAtAction(nameof(GetPlaylistById), new { id = createdPlaylist.Id }, createdPlaylist);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdatePlaylist([FromRoute] Guid id, [FromBody] Playlist updatedPlaylist)
    {
        var playlist = await _playlistRepository.UpdatePlaylistAsync(id, updatedPlaylist);
        if (playlist == null)
            return NotFound();

        return Ok(playlist);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeletePlaylist([FromRoute] Guid id)
    {
        var deletedPlaylist = await _playlistRepository.DeletePlaylistAsync(id);
        if (deletedPlaylist == null)
            return NotFound();

        return NoContent();
    }
}