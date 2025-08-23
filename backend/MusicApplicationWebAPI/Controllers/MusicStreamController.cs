using Microsoft.AspNetCore.Mvc;
using MusicApplicationWebAPI.Dtos.MusicStream;
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

        [HttpGet("music-artist/{id:guid}")]

        public async Task<IActionResult> GetStreamsByMusicArtistId(Guid id)
        {
            var musicStreams = await _musicStreamRepository.GetStreamsByMusicArtistId(id);
            return Ok(musicStreams);
        }

        [HttpGet("top-music-tracks/music-artist/{id:guid}")]
        public async Task<IActionResult> GetTopMusicTracksOfMusicArtist(Guid id)
        {
            var musicStreams = await _musicStreamRepository.GetTopMusicTracksOfMusicArtist(id);
            return Ok(musicStreams);
        }

        [HttpGet("user/{id:guid}")]
        public async Task<IActionResult> GetStreamsByUserId(Guid id)
        {
            var musicStreams = await _musicStreamRepository.GetStreamsByUserId(id);
            return Ok(musicStreams);
        }

        [HttpGet("top-music-tracks/user/{id:guid}")]
        public async Task<IActionResult> GetTopMusicTracksOfUserThisMonth(Guid id)
        {
            var musicTracks = await _musicStreamRepository.GetTopMusicTracksOfUserThisMonth(id);
            return Ok(musicTracks);
        }

        [HttpGet("top-music-artists/user/{id:guid}")]
        public async Task<IActionResult> GetTopMusicArtistsOfUserThisMonth(Guid id)
        {
            var musicArtists = await _musicStreamRepository.GetTopMusicArtistsOfUserThisMonth(id);
            return Ok(musicArtists);
        }

        [HttpGet("top-music-tracks")]
        public async Task<IActionResult> GetTopMusicTracksToday()
        {
            var musicTracks = await _musicStreamRepository.GetTopMusicTracksToday();
            return Ok(musicTracks);
        }

        [HttpGet("top-music-albums")]
        public async Task<IActionResult> GetTopMusicAlbumsToday()
        {
            var musicAlbums = await _musicStreamRepository.GetTopMusicAlbumsToday();
            return Ok(musicAlbums);
        }

        [HttpPost("start")]
        public async Task<IActionResult> StartStream([FromBody] StartMusicStreamDto dto)
        {
            if (dto == null)
                return BadRequest("Request body is required.");

            if (dto.UserId == Guid.Empty || dto.TrackId == Guid.Empty)
                return BadRequest("UserId and TrackId are required.");

            var createdStream = await _musicStreamRepository.StartStream(dto.UserId, dto.TrackId);
            return CreatedAtAction(nameof(GetAllMusicStreams), new { id = createdStream.Id }, createdStream);
        }

        [HttpPost("end")]
        public async Task<IActionResult> EndStream([FromBody] EndMusicStreamDto dto)
        {
            if (dto == null)
                return BadRequest("Request body is required.");

            if (dto.StreamId == Guid.Empty)
                return BadRequest("StreamId is required.");

            var updatedStream = await _musicStreamRepository.EndStream(dto.StreamId);
            return Ok(updatedStream);
        }
    }
}