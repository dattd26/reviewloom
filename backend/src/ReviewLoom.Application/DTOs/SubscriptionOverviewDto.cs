using System;
using System.Collections.Generic;

namespace ReviewLoom.Application.DTOs;

public class SubscriptionOverviewDto
{
    public string PlanName { get; set; } = "Free Plan";
    public string Status { get; set; } = "trialing";
    public DateTime? RenewsAt { get; set; }
    public int CampaignsUsed { get; set; }
    public int CampaignsLimit { get; set; } = 3; // free limit
    public string? CardBrand { get; set; }
    public string? CardLast4 { get; set; }
    public List<BillingHistoryItemDto> BillingHistory { get; set; } = new();
}
