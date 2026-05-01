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

        var clerkId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(clerkId)) return Unauthorized();

        var user = await _unitOfWork.Users.GetByClerkIdAsync(clerkId);
        if (user == null)
        {
            return BadRequest("User not found in system");
        }
        
        var userId = user.Id;
        
        var campaign = await _campaignService.CreateCampaignAsync(dto, userId);
        return CreatedAtAction(nameof(GetById), new { id = campaign.Id }, campaign);
    }
}
