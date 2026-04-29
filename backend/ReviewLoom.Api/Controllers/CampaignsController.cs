using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReviewLoom.Application.DTOs;
using ReviewLoom.Application.Services;

namespace ReviewLoom.Api.Controllers;

[ApiController]
[Route("v1/[controller]")]
[Authorize]
public class CampaignsController : ControllerBase
{
    private readonly ICampaignService _campaignService;
    private readonly IStatsService _statsService;

    public CampaignsController(ICampaignService campaignService, IStatsService statsService)
    {
        _campaignService = campaignService;
        _statsService = statsService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var campaigns = await _campaignService.GetAllCampaignsAsync();
        return Ok(campaigns);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var campaign = await _campaignService.GetCampaignByIdAsync(id);
        if (campaign == null) return NotFound();
        return Ok(campaign);
    }

    [HttpGet("{id}/stats")]
    public async Task<IActionResult> GetStats(Guid id)
    {
        // Add check if campaign belongs to user later if needed
        var stats = await _statsService.GetCampaignStatsAsync(id);
        return Ok(stats);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCampaignDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        // Note: Clerk user IDs are strings. If your DB uses UUID, you need to map them.
        // For demonstration, we'll parse if it's a GUID, otherwise generate one.
        if (!Guid.TryParse(userIdString, out var userId))
        {
            userId = Guid.NewGuid(); // Placeholder
        }
        
        var campaign = await _campaignService.CreateCampaignAsync(dto, userId);
        return CreatedAtAction(nameof(GetById), new { id = campaign.Id }, campaign);
    }
}
