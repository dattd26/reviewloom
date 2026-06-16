using System;
using System.Threading.Tasks;
using ReviewLoom.Domain.Entities;

namespace ReviewLoom.Domain.Interfaces;

public interface IScanRepository : IRepository<Scan>
{
    Task LogScanAsync(Guid campaignId, string action, int rating, string? feedbackName, string? feedbackEmail, string? feedbackMessage);
    Task<IEnumerable<(Guid Id, Guid CampaignId, string CampaignBusinessName, int Rating, string? FeedbackName, string? FeedbackEmail, string? FeedbackMessage, DateTime ScannedAt, string Status, string? ReplyMessage, DateTime? RepliedAt)>> GetPrivateFeedbackListAsync(Guid userId, Guid? campaignId, string? status, string? search);
}
