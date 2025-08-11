using Microsoft.AspNetCore.Mvc;
using MusicApplicationWebAPI.Interfaces;
using MusicApplicationWebAPI.Models.Entities;

namespace MusicApplicationWebAPI.Controllers
{
    [ApiController]
    [Route("music-stream")]
    public class MusicStreamsController : ControllerBase
    {
        private readonly IMusicStreamRepository _musicStreamRepository;

        public MusicStreamsController(IMusicStreamRepository musicStreamsRepository)
        {
            _musicStreamRepository = musicStreamsRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllMusicStreams()
        {
            var musicStreams = await _musicStreamRepository.GetAllMusicStreams();
            return Ok(musicStreams);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMusicStream([FromBody] MusicStream musicStream)
        {
            if (musicStream == null)
            {
                return BadRequest("MusicStream data is required.");
            }

            var createdStream = await _musicStreamRepository.CreateMusicStream(musicStream);
            return CreatedAtAction(nameof(GetAllMusicStreams), new { id = createdStream.Id }, createdStream);
        }
    }
}
