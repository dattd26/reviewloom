using System;

namespace ReviewLoom.Domain.Entities;

public class CampaignStyle
{
    public Guid CampaignId { get; set; }
    public string PrimaryColor { get; set; } = "#0037b0";
    public string FontFamily { get; set; } = "Manrope";
    public string LogoStyle { get; set; } = "soft"; 
    public string RatingIconType { get; set; } = "stars";
    
    // Background
    public string BackgroundStyle { get; set; } = "none";
    public string? BackgroundImage { get; set; }
    public string? BackgroundGradient { get; set; }

    // QR Styling
    public string QrDotColor { get; set; } = "#000000";
    public string QrFrame { get; set; } = "none";

    // Navigation Property
    public virtual Campaign Campaign { get; set; } = null!;
}
