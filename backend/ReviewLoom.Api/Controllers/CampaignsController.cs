using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ReviewLoom.Application.DTOs;
using ReviewLoom.Application.Services;

namespace ReviewLoom.Api.Controllers;

[ApiController]
[Route("v1/[controller]")]
public class CampaignsController : ControllerBase
{
    private readonly ICampaignService _campaignService;

    public CampaignsController(ICampaignService campaignService)
    {
        _campaignService = campaignService;
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

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCampaignDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        // TODO: Get user id from claims (Clerk auth)
        var userId = Guid.NewGuid();
        
        var campaign = await _campaignService.CreateCampaignAsync(dto, userId);
        return CreatedAtAction(nameof(GetById), new { id = campaign.Id }, campaign);
    }
}
