namespace ReviewLoom.Application.DTOs;

public class PublicCampaignDto
{
    public string BusinessName { get; set; } = null!;
    public string? LogoUrl { get; set; }
    public string? GoogleReviewUrl { get; set; }
    public CampaignStyleDto Style { get; set; } = new();
    public CampaignSettingsDto Settings { get; set; } = new();
    public bool ShowWatermark { get; set; }
}
