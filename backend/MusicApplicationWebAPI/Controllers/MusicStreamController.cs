using Microsoft.AspNetCore.Mvc;
using MusicApplicationWebAPI.Dtos.MusicAlbum;
using MusicApplicationWebAPI.Interfaces;

namespace MusicApplicationWebAPI.Controllers
{
    [ApiController]
    [Route("music-stream")]
    public class MusicStreamController : ControllerBase
    {
        private readonly IMusicStreamRepository _musicStreamRepository;

        public MusicStreamController(IMusicStreamRepository musicStreamRepository)
        {
            _musicStreamRepository = musicStreamRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllMusicStreams()
        {
            var musicStreams = await _musicStreamRepository.GetAllMusicStreams();
            return Ok(musicStreams);
        }

        [HttpPost]
        public async Task<IActionResult> AddMusicStream([FromBody] AddMusicStreamDto addMusicStreamDto)
        {
            if (addMusicStreamDto == null)
            {
                return BadRequest("MusicStream data is required.");
            }

            var createdStream = await _musicStreamRepository.AddMusicStream(addMusicStreamDto);
            return CreatedAtAction(nameof(GetAllMusicStreams), new { id = createdStream.Id }, createdStream);
        }
    }
}