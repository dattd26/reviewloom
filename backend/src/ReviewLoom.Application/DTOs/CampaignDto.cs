using ReviewLoom.Domain.Enums;

namespace ReviewLoom.Application.DTOs;

public class CampaignDto
{
    public Guid Id { get; set; }
    public string Slug { get; set; } = null!;
    public string BusinessName { get; set; } = null!;
    public string? GoogleReviewUrl { get; set; }
    public bool IsActive { get; set; }
    public string? LogoUrl { get; set; }
    public CampaignStatus Status { get; set; }
    public DateTime? CreatedAt { get; set; }
    public string? Placement { get; set; }
    public CampaignStatsDto Stats { get; set; } = new();
    public CampaignStyleDto Style { get; set; } = new();
    public CampaignSettingsDto Settings { get; set; } = new();
    public CampaignStandeeConfigDto? StandeeConfig { get; set; }
    public bool ShowWatermark { get; set; }
}

public class CampaignStyleDto
{
    public string PrimaryColor { get; set; } = "#0037b0";
    public string FontFamily { get; set; } = "Manrope";
    public string LogoStyle { get; set; } = "soft";
    public string RatingIconType { get; set; } = "stars";
    public string BackgroundStyle { get; set; } = "none";
    public string? BackgroundImage { get; set; }
    public string? BackgroundGradient { get; set; }
    public string QrDotColor { get; set; } = "#000000";
    public string QrFrame { get; set; } = "none";
}

public class CampaignSettingsDto
{
    public int RoutingThreshold { get; set; } = 4;
    public string Heading { get; set; } = "How was your experience?";
    public string CtaLabel { get; set; } = "Submit Feedback";
    public string? ThankYouMessage { get; set; }
    public bool CollectContact { get; set; }
    public bool IncentiveEnabled { get; set; }
    public string? IncentiveCoupon { get; set; }
}

public class CampaignStandeeConfigDto
{
    public string TemplateId { get; set; } = "minimal_white";
    public string? CtaText { get; set; }
    public bool ShowLogo { get; set; } = true;
}
