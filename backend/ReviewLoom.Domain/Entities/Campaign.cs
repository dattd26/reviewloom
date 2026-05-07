using System;
using System.Collections.Generic;

namespace ReviewLoom.Domain.Entities;

public partial class Campaign
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string Slug { get; set; } = null!;

    public string GoogleReviewUrl { get; set; } = null!;

    public string BusinessName { get; set; } = null!;

    public bool IsActive { get; set; } = true;

    public string? LogoUrl { get; set; }

    public string? ThankYouMessage { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Scan> Scans { get; set; } = new List<Scan>();

    public virtual User User { get; set; } = null!;

    // Normalized Components
    public virtual CampaignStyle Style { get; set; } = null!;
    public virtual CampaignSettings Settings { get; set; } = null!;
    public virtual CampaignStandeeConfig? StandeeConfig { get; set; }
}
