using System;

namespace ReviewLoom.Domain.Entities;

public class CampaignStandeeConfig
{
    public Guid CampaignId { get; set; }
    public string TemplateId { get; set; } = "minimal_white";
    public string? CtaText { get; set; }
    public bool ShowLogo { get; set; } = true;

    // Navigation Property
    public virtual Campaign Campaign { get; set; } = null!;
}
