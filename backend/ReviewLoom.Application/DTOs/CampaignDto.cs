using System;

namespace ReviewLoom.Application.DTOs;

public class CampaignDto
{
    public Guid Id { get; set; }
    public string Slug { get; set; } = null!;
    public string GoogleReviewUrl { get; set; } = null!;
    public string BusinessName { get; set; } = null!;
    public string? LogoUrl { get; set; }
    public string? ThankYouMessage { get; set; }
    public DateTime? CreatedAt { get; set; }
}
