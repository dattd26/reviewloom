using System;
using System.Collections.Generic;

using ReviewLoom.Domain.Enums;

namespace ReviewLoom.Domain.Entities;

public partial class Campaign
{
    public Guid Id { get; set; }

    public CampaignStatus Status { get; set; } = CampaignStatus.Draft;

    public Guid UserId { get; set; }

    public string Slug { get; set; } = null!;

    public string? GoogleReviewUrl { get; set; }

    public string BusinessName { get; set; } = null!;

    public string? LogoUrl { get; set; }

    public string? ThankYouMessage { get; set; }

    public DateTime? CreatedAt { get; set; }

    public string? Placement { get; set; }

    public virtual ICollection<Scan> Scans { get; set; } = new List<Scan>();

    public virtual User User { get; set; } = null!;

    // Normalized Components
    public virtual CampaignStyle Style { get; set; } = null!;
    public virtual CampaignSettings Settings { get; set; } = null!;
    public virtual CampaignStandeeConfig? StandeeConfig { get; set; }
}
