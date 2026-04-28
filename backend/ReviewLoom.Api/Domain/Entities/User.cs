using System;
using System.Collections.Generic;

namespace ReviewLoom.Api.Domain.Entities;

public partial class User
{
    public Guid Id { get; set; }

    public string Email { get; set; } = null!;

    public string? BusinessName { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Campaign> Campaigns { get; set; } = new List<Campaign>();

    public virtual ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
}
