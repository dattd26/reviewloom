using System;

namespace ReviewLoom.Domain.Entities;

public class CampaignSettings
{
    public Guid CampaignId { get; set; }
    public int RoutingThreshold { get; set; } = 4;
    public string Heading { get; set; } = "How was your experience?";
    public string CtaLabel { get; set; } = "Submit Feedback";
    public string? ThankYouMessage { get; set; }

    // Features
    public bool CollectContact { get; set; }
    public bool IncentiveEnabled { get; set; }
    public string? IncentiveCoupon { get; set; }

    // Navigation Property
    public virtual Campaign Campaign { get; set; } = null!;
}
