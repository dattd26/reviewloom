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
    private readonly IEmailQueue _emailQueue;

    public InboxService(IUnitOfWork unitOfWork, IEmailQueue emailQueue)
    {
        _unitOfWork = unitOfWork;
        _emailQueue = emailQueue;
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

        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null) return false;

        scan.ReplyMessage = replyMessage;
        scan.RepliedAt = DateTime.UtcNow;
        scan.Status = "resolved";

        _unitOfWork.Scans.Update(scan);
        await _unitOfWork.CompleteAsync();

        if (!string.IsNullOrWhiteSpace(scan.FeedbackEmail))
        {
            var reviewerName = !string.IsNullOrWhiteSpace(scan.FeedbackName) ? scan.FeedbackName : "Customer";
            var businessName = !string.IsNullOrWhiteSpace(campaign.BusinessName) ? campaign.BusinessName : "ReviewLoom Partner";
            
            var subject = $"{businessName} - Response to your feedback";
            
            var body = $@"
<div style=""font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;"">
  <h2 style=""color: #1a202c; font-size: 20px; margin-top: 0;"">Hi {reviewerName},</h2>
  <p style=""color: #4a5568; font-size: 16px; line-height: 1.5;"">Thank you for sharing your feedback with <strong>{businessName}</strong>.</p>
  <p style=""color: #4a5568; font-size: 16px; line-height: 1.5;"">We wanted to reach out regarding your comment:</p>
  <blockquote style=""margin: 16px 0; padding: 12px 16px; background-color: #f7fafc; border-left: 4px solid #cbd5e0; color: #718096; font-style: italic;"">
    ""{scan.FeedbackMessage}""
  </blockquote>
  <p style=""color: #4a5568; font-size: 16px; line-height: 1.5;"">Here is our response:</p>
  <div style=""margin: 16px 0; padding: 16px; background-color: #ebf8ff; border: 1px solid #bee3f8; border-radius: 6px; color: #2b6cb0; font-size: 16px; line-height: 1.5;"">
    {replyMessage}
  </div>
  <p style=""color: #718096; font-size: 14px; margin-top: 24px;"">If you have any further questions, you can reply directly to this email to contact us.</p>
  <hr style=""border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;""/>
  <p style=""color: #a0aec0; font-size: 12px; margin-bottom: 0;"">Sent by ReviewLoom on behalf of {businessName}.</p>
</div>";

            await _emailQueue.QueueEmailAsync(new EmailMessage(
                scan.FeedbackEmail,
                subject,
                body,
                user.Email,
                businessName
            ));
        }

        return true;
    }
}
