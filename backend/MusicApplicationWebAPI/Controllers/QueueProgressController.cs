using Microsoft.AspNetCore.Mvc;
using MusicApplicationWebAPI.Interfaces;

namespace MusicApplicationWebAPI.Controllers
{
    [ApiController]
    [Route("/queue-progress")]
    public class QueueProgressController : ControllerBase
    {
        private readonly IQueueProgressRepository _repository;

        public QueueProgressController(IQueueProgressRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("{userId:guid}/{queueId:guid}")]
        public async Task<IActionResult> GetProgress(Guid userId, Guid queueId)
        {
            var progress = await _repository.GetProgress(userId, queueId);
            if (progress == null)
                return NotFound();

            return Ok(new
            {
                progress.QueueItemId,
                progressInSeconds = (int)progress.Progress.TotalSeconds,
                updatedAt = progress.UpdatedAt
            });
        }

        [HttpPost]
        public async Task<IActionResult> SetProgress([FromBody] SetProgressRequest request)
        {
            var updated = await _repository.SetProgress(
                request.UserId,
                request.QueueId,
                request.QueueItemId,
                TimeSpan.FromSeconds(request.ProgressInSeconds)
            );

            return Ok(new
            {
                updated.Id,
                updated.Progress,
                updated.UpdatedAt
            });
        }

        public class SetProgressRequest
        {
            public Guid UserId { get; set; }
            public Guid QueueId { get; set; }
            public Guid QueueItemId { get; set; }
            public int ProgressInSeconds { get; set; }
        }
    }
}