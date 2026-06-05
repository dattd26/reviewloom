using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReviewLoom.Application.Interfaces;
using ReviewLoom.Domain.Interfaces;

namespace ReviewLoom.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class InboxController : ControllerBase
{
    private readonly IInboxService _inboxService;
    private readonly IUnitOfWork _unitOfWork;

    public InboxController(IInboxService inboxService, IUnitOfWork unitOfWork)
    {
        _inboxService = inboxService;
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<IActionResult> GetFeedbackList([FromQuery] Guid? campaignId, [FromQuery] string? status, [FromQuery] string? search)
    {
        var userId = await GetCurrentUserIdAsync();
        if (userId == null) return Unauthorized();

        var feedbackList = await _inboxService.GetFeedbackListAsync(userId.Value, campaignId, status, search);
        return Ok(feedbackList);
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateFeedbackStatus(Guid id, [FromBody] UpdateStatusRequest request)
    {
        var userId = await GetCurrentUserIdAsync();
        if (userId == null) return Unauthorized();

        var success = await _inboxService.UpdateFeedbackStatusAsync(id, userId.Value, request.Status);
        if (!success) return NotFound();

        return NoContent();
    }

    [HttpPost("{id}/reply")]
    public async Task<IActionResult> SendFeedbackReply(Guid id, [FromBody] ReplyFeedbackRequest request)
    {
        var userId = await GetCurrentUserIdAsync();
        if (userId == null) return Unauthorized();

        var success = await _inboxService.SendFeedbackReplyAsync(id, userId.Value, request.ReplyMessage);
        if (!success) return NotFound();

        return NoContent();
    }

    private async Task<Guid?> GetCurrentUserIdAsync()
    {
        var clerkId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(clerkId)) return null;

        var user = await _unitOfWork.Users.GetByClerkIdAsync(clerkId);
        return user?.Id;
    }
}

public class UpdateStatusRequest
{
    public string Status { get; set; } = string.Empty;
}

public class ReplyFeedbackRequest
{
    public string ReplyMessage { get; set; } = string.Empty;
}
