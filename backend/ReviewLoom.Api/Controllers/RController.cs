using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ReviewLoom.Application.DTOs;
using ReviewLoom.Application.Interfaces;
using ReviewLoom.Domain.Enums;
using ReviewLoom.Domain.Interfaces;

namespace ReviewLoom.Api.Controllers;

[ApiController]
[Route("api/v1/r")]
public class RController : ControllerBase
{
    private readonly ICampaignService _campaignService;
    private readonly IScanService _scanService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IStatsRepository _statsRepository;

    public RController(ICampaignService campaignService, IScanService scanService, IUnitOfWork unitOfWork, IStatsRepository statsRepository)
    {
        _campaignService = campaignService;
        _scanService = scanService;
        _unitOfWork = unitOfWork;
        _statsRepository = statsRepository;
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var campaignEntity = await _unitOfWork.Campaigns.GetBySlugAsync(slug);
        if (campaignEntity == null || campaignEntity.Status != CampaignStatus.Published)
            return NotFound();

        var campaign = await _campaignService.GetCampaignBySlugAsync(slug);
        if (campaign == null)
            return NotFound();

        var subscriptions = await _unitOfWork.Subscriptions.GetByUserIdAsync(campaignEntity.UserId);
        var subscription = System.Linq.Enumerable.FirstOrDefault(subscriptions, s => s.Status == "active");
        bool isPro = subscription != null && subscription.PlanId != null;

        return Ok(new
        {
            campaign.BusinessName,
            campaign.LogoUrl,
            campaign.GoogleReviewUrl,
            campaign.Style,
            campaign.Settings,
            showWatermark = !isPro
        });
    }

    [HttpPost("{slug}/scan")]
    public async Task<IActionResult> LogScan(string slug, [FromBody] LogScanDto request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var campaignEntity = await _unitOfWork.Campaigns.GetBySlugAsync(slug);
            if (campaignEntity == null || campaignEntity.Status != CampaignStatus.Published)
                return NotFound("Campaign not found");

            var subscriptions = await _unitOfWork.Subscriptions.GetByUserIdAsync(campaignEntity.UserId);
            var subscription = System.Linq.Enumerable.FirstOrDefault(subscriptions, s => s.Status == "active");
            bool isPro = subscription != null && subscription.PlanId != null;

            if (!isPro)
            {
                var monthStart = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1, 0, 0, 0, DateTimeKind.Utc);
                var usage = await _statsRepository.GetUserMonthlyUsageAsync(campaignEntity.UserId, monthStart);

                if (usage.TotalScans >= 100)
                {
                    // Ignore scan but return success to avoid breaking frontend
                    return Ok(new { Message = "Scan logged successfully (limit reached)" });
                }

                if ((request.Action == "negative" || request.Rating < 4 || !string.IsNullOrEmpty(request.FeedbackMessage)) && usage.TotalFeedback >= 50)
                {
                    // Ignore feedback but return success to avoid breaking frontend
                    return Ok(new { Message = "Scan logged successfully (feedback limit reached)" });
                }
            }

            await _scanService.LogScanAsync(slug, request);
            return Ok(new { Message = "Scan logged successfully" });
        }
        catch (System.ArgumentException)
        {
            return NotFound("Campaign not found");
        }
    }
}
