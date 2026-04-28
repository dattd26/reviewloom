using System;
using System.Collections.Generic;

namespace ReviewLoom.Api.Domain.Entities;

public partial class Scan
{
    public Guid Id { get; set; }

    public Guid CampaignId { get; set; }

    public string Action { get; set; } = null!;

    public string? FeedbackName { get; set; }

    public string? FeedbackEmail { get; set; }

    public string? FeedbackMessage { get; set; }

    public DateTime? ScannedAt { get; set; }

    public virtual Campaign Campaign { get; set; } = null!;
}
