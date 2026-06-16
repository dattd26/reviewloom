using System;
using System.Threading.Tasks;
using ReviewLoom.Application.DTOs;
using ReviewLoom.Domain.Enums;
using ReviewLoom.Domain.Interfaces;
using ReviewLoom.Application.Interfaces;

namespace ReviewLoom.Application.Services;

public class ScanService : IScanService
{
    private readonly IScanRepository _scanRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IStatsRepository _statsRepository;

    public ScanService(IScanRepository scanRepository, IUnitOfWork unitOfWork, IStatsRepository statsRepository)
    {
        _scanRepository = scanRepository;
        _unitOfWork = unitOfWork;
        _statsRepository = statsRepository;
    }

    public async Task<ScanResultDto> LogScanAsync(string slug, LogScanDto request)
    {
        var campaign = await _unitOfWork.Campaigns.GetBySlugAsync(slug);

        if (campaign == null || campaign.Status != CampaignStatus.Published)
            throw new ArgumentException("Campaign not found");

        var subscriptions = await _unitOfWork.Subscriptions.GetByUserIdAsync(campaign.UserId);
        var subscription = System.Linq.Enumerable.FirstOrDefault(subscriptions, s => s.Status == "active");
        bool isPro = subscription != null && subscription.PlanId != null;

        if (!isPro)
        {
            var monthStart = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            var usage = await _statsRepository.GetUserMonthlyUsageAsync(campaign.UserId, monthStart);

            if (usage.TotalScans >= 100)
            {
                return new ScanResultDto { Success = true, Message = "Scan logged successfully (limit reached)" };
            }

            if ((request.Action == "negative" || request.Rating < 4 || !string.IsNullOrEmpty(request.FeedbackMessage)) && usage.TotalFeedback >= 50)
            {
                return new ScanResultDto { Success = true, Message = "Scan logged successfully (feedback limit reached)" };
            }
        }

        request.Action = (request.Action ?? (request.Rating >= 4 ? "positive" : "negative"))!;

        await _scanRepository.LogScanAsync(campaign.Id, request.Action, request.Rating, request.FeedbackName, request.FeedbackEmail, request.FeedbackMessage);

        return new ScanResultDto { Success = true, Message = "Scan logged successfully" };
    }
}
