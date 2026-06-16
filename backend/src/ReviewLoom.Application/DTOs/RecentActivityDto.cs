using System;

namespace ReviewLoom.Application.DTOs;

public class RecentActivityDto
{
    public Guid Id { get; set; }
    public string CampaignBusinessName { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty; // positive or negative
    public int Rating { get; set; }
    public string? FeedbackName { get; set; }
    public string? FeedbackMessage { get; set; }
    public DateTime ScannedAt { get; set; }
}
