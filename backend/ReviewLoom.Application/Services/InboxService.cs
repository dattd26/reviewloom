using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ReviewLoom.Application.DTOs;
using ReviewLoom.Application.Interfaces;
using ReviewLoom.Domain.Entities;
using ReviewLoom.Domain.Interfaces;

namespace ReviewLoom.Application.Services;

public class InboxService : IInboxService
{
    private readonly IUnitOfWork _unitOfWork;

    public InboxService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<PrivateFeedbackDto>> GetFeedbackListAsync(Guid userId, Guid? campaignId, string? status, string? search)
    {
        var rawFeedback = await _unitOfWork.Scans.GetPrivateFeedbackListAsync(userId, campaignId, status, search);

        return rawFeedback.Select(f => new PrivateFeedbackDto
        {
            Id = f.Id,
            CampaignId = f.CampaignId,
            CampaignBusinessName = f.CampaignBusinessName,
            Rating = f.Rating,
            FeedbackName = f.FeedbackName,
            FeedbackEmail = f.FeedbackEmail,
            FeedbackMessage = f.FeedbackMessage,
            ScannedAt = f.ScannedAt,
            Status = f.Status,
            ReplyMessage = f.ReplyMessage,
            RepliedAt = f.RepliedAt
        }).ToList();
    }

    public async Task<bool> UpdateFeedbackStatusAsync(Guid scanId, Guid userId, string status)
    {
        var scan = await _unitOfWork.Scans.GetByIdAsync(scanId);
        if (scan == null) return false;

        var campaign = await _unitOfWork.Campaigns.GetByIdAsync(scan.CampaignId);
        if (campaign == null || campaign.UserId != userId) return false;

        scan.Status = status;
        _unitOfWork.Scans.Update(scan);
        await _unitOfWork.CompleteAsync();

        return true;
    }

    public async Task<bool> SendFeedbackReplyAsync(Guid scanId, Guid userId, string replyMessage)
    {
        var scan = await _unitOfWork.Scans.GetByIdAsync(scanId);
        if (scan == null) return false;

        var campaign = await _unitOfWork.Campaigns.GetByIdAsync(scan.CampaignId);
        if (campaign == null || campaign.UserId != userId) return false;

        scan.ReplyMessage = replyMessage;
        scan.RepliedAt = DateTime.UtcNow;
        scan.Status = "resolved";

        _unitOfWork.Scans.Update(scan);
        await _unitOfWork.CompleteAsync();

        return true;
    }
}
