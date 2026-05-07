using System.ComponentModel.DataAnnotations;
using ReviewLoom.Domain.Enums;

namespace ReviewLoom.Application.DTOs;

public class CreateCampaignDto
{
    [Required]
    [StringLength(100)]
    public string BusinessName { get; set; } = null!;
    
    [Url]
    public string? GoogleReviewUrl { get; set; }
    
    public string? LogoUrl { get; set; }
    public CampaignStatus Status { get; set; } = CampaignStatus.Draft;

    // Optional initial configuration
    public CampaignStyleDto? Style { get; set; }
    public CampaignSettingsDto? Settings { get; set; }
}

public class UpdateCampaignDto
{
    public string? BusinessName { get; set; }
    public string? GoogleReviewUrl { get; set; }
    public string? LogoUrl { get; set; }
    public CampaignStatus? Status { get; set; }

    public CampaignStyleDto? Style { get; set; }
    public CampaignSettingsDto? Settings { get; set; }
    public CampaignStandeeConfigDto? StandeeConfig { get; set; }
}
