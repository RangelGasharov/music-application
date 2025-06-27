using Microsoft.AspNetCore.Mvc;
using MusicApplicationWebAPI.Interfaces;

namespace MusicApplicationWebAPI.Controllers
{
    [ApiController]
    [Route("queue")]
    public class QueueController : ControllerBase
    {
        private readonly IQueueRepository _queueRepository;

        public QueueController(IQueueRepository queueRepository)
        {
            _queueRepository = queueRepository;
        }

        public class CreateQueueRequest
        {
            public Guid UserId { get; set; }
            public string? Name { get; set; }
        }

        public class AddTrackRequest
        {
            public int TrackId { get; set; }
        }

        public class ReorderRequest
        {
            public Guid ItemId { get; set; }
            public string? LeftPosition { get; set; }
            public string? RightPosition { get; set; }
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetQueue(Guid id)
        {
            var queue = await _queueRepository.GetQueue(id);
            if (queue == null)
                return NotFound();

            return Ok(queue);
        }

        [HttpGet("user-id/{userId:guid}")]
        public async Task<IActionResult> GetQueueByUserId(Guid userId)
        {
            var queue = await _queueRepository.GetQueueByUserId(userId);

            if (queue == null)
                return NotFound();

            return Ok(queue);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteQueue(Guid id)
        {
            var success = await _queueRepository.DeleteQueue(id);

            if (!success)
                return NotFound();

            return NoContent();
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateQueue([FromBody] CreateQueueRequest request)
        {
            if (request == null || request.UserId == Guid.Empty)
                return BadRequest("Invalid request");

            var queue = await _queueRepository.CreateQueue(request.UserId, request.Name);
            return CreatedAtAction(nameof(GetQueue), new { id = queue.Id }, queue);
        }

        [HttpPost("{queueId:guid}/add")]
        public async Task<IActionResult> AddTrack(Guid queueId, [FromBody] AddTrackRequest request)
        {
            if (request == null || request.TrackId <= 0)
                return BadRequest("Invalid request");

            var item = await _queueRepository.AddTrackToQueue(queueId, request.TrackId);
            return Ok(item);
        }

        [HttpPost("{queueId:guid}/reorder")]
        public async Task<IActionResult> ReorderItem(Guid queueId, [FromBody] ReorderRequest request)
        {
            if (request == null || request.ItemId == Guid.Empty)
                return BadRequest("Invalid request");

            try
            {
                var item = await _queueRepository.ReorderTrack(request.ItemId, request.LeftPosition, request.RightPosition);
                return Ok(item);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}