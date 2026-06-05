using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ReviewLoom.Domain.Interfaces;

public interface IStatsRepository
{
    Task<(long Total, long Positive, long Negative)> GetCampaignStatsAsync(Guid campaignId);
    Task<(long Total, long Positive, long Negative)> GetOverallStatsAsync(Guid userId);
    Task<IEnumerable<(DateTime Date, long Total, long Positive, long Negative)>> GetScansGrowthAsync(Guid userId, int days);
    Task<IEnumerable<(Guid Id, string CampaignBusinessName, string Action, int Rating, string? FeedbackName, string? FeedbackMessage, DateTime ScannedAt)>> GetRecentActivityAsync(Guid userId, int limit);
}
