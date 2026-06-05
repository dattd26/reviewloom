using System;

namespace ReviewLoom.Application.DTOs;

public class PrivateFeedbackDto
{
    public Guid Id { get; set; }
    public Guid CampaignId { get; set; }
    public string CampaignBusinessName { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string? FeedbackName { get; set; }
    public string? FeedbackEmail { get; set; }
    public string? FeedbackMessage { get; set; }
    public DateTime ScannedAt { get; set; }
    public string Status { get; set; } = "unread"; // unread, pending, resolved
    public string? ReplyMessage { get; set; }
    public DateTime? RepliedAt { get; set; }
}
