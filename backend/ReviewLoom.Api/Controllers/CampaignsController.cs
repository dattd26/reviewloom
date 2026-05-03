using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReviewLoom.Application.DTOs;
using ReviewLoom.Application.Services;
using ReviewLoom.Domain.Interfaces;

namespace ReviewLoom.Api.Controllers;

[ApiController]
[Route("v1/[controller]")]
[Authorize]
public class CampaignsController : ControllerBase
{
    private readonly ICampaignService _campaignService;
    private readonly IStatsService _statsService;
    private readonly IUnitOfWork _unitOfWork;

    public CampaignsController(ICampaignService campaignService, IStatsService statsService, IUnitOfWork unitOfWork)
    {
        _campaignService = campaignService;
        _statsService = statsService;
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<IActionResult> GetUserCampaigns()
    {
        var userId = await GetCurrentUserIdAsync();
        if (userId == null) return Unauthorized();

        var campaigns = await _campaignService.GetUserCampaignsAsync(userId.Value);
        return Ok(campaigns);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var campaign = await _campaignService.GetCampaignByIdAsync(id);
        if (campaign == null) return NotFound();

        var userId = await GetCurrentUserIdAsync();
        if (userId == null) return Unauthorized();

        return Ok(campaign);
    }

    [HttpGet("{id}/stats")]
    public async Task<IActionResult> GetStats(Guid id)
    {
        var stats = await _statsService.GetCampaignStatsAsync(id);
        return Ok(stats);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCampaignDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var userId = await GetCurrentUserIdAsync();
        if (userId == null) return Unauthorized();

        var campaign = await _campaignService.CreateCampaignAsync(dto, userId.Value);
        return CreatedAtAction(nameof(GetById), new { id = campaign.Id }, campaign);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCampaignDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var campaign = await _campaignService.UpdateCampaignAsync(id, dto);
        if (campaign == null) return NotFound();

        return Ok(campaign);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _campaignService.DeleteCampaignAsync(id);
        if (!result) return NotFound();

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
