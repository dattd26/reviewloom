
namespace ReviewLoom.Domain.Entities;

public partial class Scan
{
    public Guid Id { get; set; }

    public Guid CampaignId { get; set; }

    // negative or positive
    public string Action { get; set; } = null!;

    public int Rating { get; set; }

    public string? FeedbackName { get; set; }

    public string? FeedbackEmail { get; set; }

    public string? FeedbackMessage { get; set; }

    public DateTime? ScannedAt { get; set; }

    public virtual Campaign Campaign { get; set; } = null!;
}
