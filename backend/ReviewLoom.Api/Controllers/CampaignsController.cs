using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReviewLoom.Application.DTOs;
using ReviewLoom.Application.Interfaces;

namespace ReviewLoom.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class CampaignsController : ControllerBase
{
    private readonly ICampaignService _campaignService;
    private readonly IStatsService _statsService;
    private readonly IUserService _userService;

    public CampaignsController(ICampaignService campaignService, IStatsService statsService, IUserService userService)
    {
        _campaignService = campaignService;
        _statsService = statsService;
        _userService = userService;
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

        try
        {
            var campaign = await _campaignService.CreateCampaignAsync(dto, userId.Value);
            return CreatedAtAction(nameof(GetById), new { id = campaign.Id }, campaign);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
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

        return await _userService.GetUserIdByClerkIdAsync(clerkId);
    }
}
