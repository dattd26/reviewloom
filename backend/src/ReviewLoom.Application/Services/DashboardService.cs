using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ReviewLoom.Application.DTOs;
using ReviewLoom.Application.Interfaces;
using ReviewLoom.Domain.Interfaces;

namespace ReviewLoom.Application.Services;

public class DashboardService : IDashboardService
{
    private readonly IStatsRepository _statsRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DashboardService(IStatsRepository statsRepository, IUnitOfWork unitOfWork)
    {
        _statsRepository = statsRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<DashboardOverviewDto> GetDashboardOverviewAsync(Guid userId, DateTime? fromDate = null, DateTime? toDate = null)
    {
        var endDate = (toDate ?? DateTime.UtcNow).Date;
        var startDate = (fromDate ?? endDate.AddDays(-29)).Date;

        if (startDate > endDate)
        {
            throw new ArgumentException("fromDate must be earlier than or equal to toDate.");
        }

        var subscriptions = await _unitOfWork.Subscriptions.GetByUserIdAsync(userId);
        var subscription = System.Linq.Enumerable.FirstOrDefault(subscriptions, s => s.Status == "active");
        bool isPro = subscription != null && subscription.PlanId != null;

        if (!isPro)
        {
            // Free tier gets max 7 days of analytics
            var minStartDate = endDate.AddDays(-6);
            if (startDate < minStartDate)
            {
                startDate = minStartDate;
            }
        }
        else if ((endDate - startDate).TotalDays > 365)
        {
            // Pro tier gets max 365 days
            startDate = endDate.AddDays(-365);
        }

        var overall = await _statsRepository.GetOverallStatsAsync(userId, startDate, endDate);
        var growth = await _statsRepository.GetScansGrowthAsync(userId, startDate, endDate);
        var recent = await _statsRepository.GetRecentActivityAsync(userId, 10, startDate, endDate);

        var growthList = growth.Select(g => new DailyScanGrowthDto
        {
            Date = g.Date,
            Total = g.Total,
            Positive = g.Positive,
            Negative = g.Negative
        }).ToList();

        var recentList = recent.Select(r => new RecentActivityDto
        {
            Id = r.Id,
            CampaignBusinessName = r.CampaignBusinessName,
            Action = r.Action,
            Rating = r.Rating,
            FeedbackName = r.FeedbackName,
            FeedbackMessage = r.FeedbackMessage,
            ScannedAt = r.ScannedAt
        }).ToList();

        double positivePercent = overall.Total > 0 
            ? Math.Round((double)overall.Positive / overall.Total * 100) 
            : 0;

        return new DashboardOverviewDto
        {
            TotalScans = overall.Total,
            PositivePercentage = positivePercent,
            NewPrivateFeedback = overall.Negative,
            ScansGrowth = growthList,
            RecentActivity = recentList
        };
    }
}
