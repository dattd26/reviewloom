using System;
using System.Collections.Generic;

namespace ReviewLoom.Api.Domain.Entities;

public partial class Campaign
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string Slug { get; set; } = null!;

    public string GoogleReviewUrl { get; set; } = null!;

    public string BusinessName { get; set; } = null!;

    public string? LogoUrl { get; set; }

    public string? ThankYouMessage { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Scan> Scans { get; set; } = new List<Scan>();

    public virtual User User { get; set; } = null!;
}
