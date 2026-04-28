using System;
using System.Collections.Generic;

namespace ReviewLoom.Api.Domain.Entities;

public partial class Subscription
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string PaymentProvider { get; set; } = null!;

    public string? ProviderCustomerId { get; set; }

    public string? ProviderSubscriptionId { get; set; }

    public string? PlanId { get; set; }

    public string Status { get; set; } = null!;

    public DateTime? CurrentPeriodEnd { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
