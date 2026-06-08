using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ReviewLoom.Application.DTOs;
using ReviewLoom.Application.Interfaces;

namespace ReviewLoom.Api.Controllers;

[ApiController]
[Route("api/v1/r")]
public class RController : ControllerBase
{
    private readonly ICampaignService _campaignService;
    private readonly IScanService _scanService;

    public RController(ICampaignService campaignService, IScanService scanService)
    {
        _campaignService = campaignService;
        _scanService = scanService;
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var campaign = await _campaignService.GetPublicCampaignBySlugAsync(slug);
        if (campaign == null)
            return NotFound();

        return Ok(new
        {
            campaign.BusinessName,
            campaign.LogoUrl,
            campaign.GoogleReviewUrl,
            campaign.Style,
            campaign.Settings,
            showWatermark = campaign.ShowWatermark
        });
    }

    [HttpPost("{slug}/scan")]
    public async Task<IActionResult> LogScan(string slug, [FromBody] LogScanDto request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var result = await _scanService.LogScanAsync(slug, request);
            return Ok(new { Message = result.Message });
        }
        catch (System.ArgumentException)
        {
            return NotFound("Campaign not found");
        }
    }
}
