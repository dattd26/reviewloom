using System.ComponentModel.DataAnnotations;

namespace ReviewLoom.Application.DTOs;

public class CreateCampaignDto
{
    [Required]
    public string BusinessName { get; set; } = null!;
    
    [Required]
    [Url]
    public string GoogleReviewUrl { get; set; } = null!;
    
    public string? LogoUrl { get; set; }
}
