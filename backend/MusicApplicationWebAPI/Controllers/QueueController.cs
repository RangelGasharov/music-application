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
            public Guid TrackId { get; set; }
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

        [HttpGet("queue-items/{id:guid}")]
        public async Task<IActionResult> GetQueueItems(Guid id)
        {
            var queueItems = await _queueRepository.GetQueueItems(id);
            if (queueItems == null)
                return NotFound();

            return Ok(queueItems);
        }

        [HttpGet("queue-items-with-tracks/{id:guid}")]
        public async Task<IActionResult> GetQueueItemsWithTracks(Guid id)
        {
            var items = await _queueRepository.GetQueueItemsWithTracks(id);
            return Ok(items);
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
            if (request == null)
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

        [HttpDelete("{queueId:guid}/items")]
        public async Task<IActionResult> DeleteQueueItem(Guid queueId, [FromBody] DeleteQueueItemRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Position))
                return BadRequest(new { message = "Position is required" });

            var success = await _queueRepository.DeleteQueueItemByPosition(queueId, request.Position);

            if (!success)
                return NotFound(new { message = $"Queue item not found at position {request.Position}" });

            return Ok(new { message = $"Deleted queue item at position {request.Position}" });
        }
    }
}