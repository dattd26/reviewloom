using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ReviewLoom.Application.DTOs;
using ReviewLoom.Application.Services;

namespace ReviewLoom.Api.Controllers;

[ApiController]
[Route("v1/r")]
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
        var campaign = await _campaignService.GetCampaignBySlugAsync(slug);
        if (campaign == null)
            return NotFound();

        // Map to a public DTO that doesn't expose sensitive info if needed, 
        // for now returning the basic info required by landing page.
        return Ok(new
        {
            campaign.BusinessName,
            campaign.LogoUrl,
            campaign.GoogleReviewUrl,
            campaign.ThankYouMessage
        });
    }

    [HttpPost("{slug}/scan")]
    public async Task<IActionResult> LogScan(string slug, [FromBody] LogScanDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            await _scanService.LogScanAsync(slug, dto);
            return Ok(new { Message = "Scan logged successfully" });
        }
        catch (System.ArgumentException)
        {
            return NotFound("Campaign not found");
        }
    }
}
