using ReviewLoom.Application.DTOs;
using ReviewLoom.Domain.Entities;

namespace ReviewLoom.Application.Mappings;

public static class CampaignMappingExtensions
{
    //this Campaign campaign biến method đó thành một extension method cho class Campaign
    public static CampaignDto ToDto(this Campaign campaign, (long Total, long Positive, long Negative) stats)
    {
        return new CampaignDto
        {
            Id = campaign.Id,
            Slug = campaign.Slug,
            BusinessName = campaign.BusinessName,
            GoogleReviewUrl = campaign.GoogleReviewUrl,
            Status = campaign.Status,
            LogoUrl = campaign.LogoUrl,
            CreatedAt = campaign.CreatedAt,
            Placement = campaign.Placement,
            Stats = new CampaignStatsDto(stats.Total, stats.Positive, stats.Negative),
            Style = campaign.Style?.ToDto() ?? new CampaignStyleDto(),
            Settings = campaign.Settings?.ToDto() ?? new CampaignSettingsDto(),
            StandeeConfig = campaign.StandeeConfig?.ToDto()
        };
    }

    public static CampaignStyleDto ToDto(this CampaignStyle style)
    {
        return new CampaignStyleDto
        {
            PrimaryColor = style.PrimaryColor,
            FontFamily = style.FontFamily,
            LogoStyle = style.LogoStyle,
            RatingIconType = style.RatingIconType,
            BackgroundStyle = style.BackgroundStyle,
            BackgroundImage = style.BackgroundImage,
            BackgroundGradient = style.BackgroundGradient,
            QrDotColor = style.QrDotColor,
            QrFrame = style.QrFrame
        };
    }

    public static CampaignSettingsDto ToDto(this CampaignSettings settings)
    {
        return new CampaignSettingsDto
        {
            RoutingThreshold = settings.RoutingThreshold,
            Heading = settings.Heading,
            CtaLabel = settings.CtaLabel,
            ThankYouMessage = settings.ThankYouMessage,
            CollectContact = settings.CollectContact,
            IncentiveEnabled = settings.IncentiveEnabled,
            IncentiveCoupon = settings.IncentiveCoupon
        };
    }

    public static CampaignStandeeConfigDto ToDto(this CampaignStandeeConfig config)
    {
        return new CampaignStandeeConfigDto
        {
            TemplateId = config.TemplateId,
            CtaText = config.CtaText,
            ShowLogo = config.ShowLogo
        };
    }

    public static Campaign CreateEntity(this CreateCampaignDto dto, Guid userId, string slug)
    {
        return new Campaign
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Slug = slug,
            BusinessName = dto.BusinessName,
            GoogleReviewUrl = dto.GoogleReviewUrl,
            LogoUrl = dto.LogoUrl,
            Status = dto.Status,
            Placement = dto.Placement,
            CreatedAt = DateTime.UtcNow,
            Style = new CampaignStyle
            {
                PrimaryColor = dto.Style?.PrimaryColor ?? "#0037b0",
                FontFamily = dto.Style?.FontFamily ?? "Manrope",
                LogoStyle = dto.Style?.LogoStyle ?? "soft",
                RatingIconType = dto.Style?.RatingIconType ?? "stars"
            },
            Settings = new CampaignSettings
            {
                RoutingThreshold = dto.Settings?.RoutingThreshold ?? 4,
                Heading = dto.Settings?.Heading ?? "How was your experience?",
                CtaLabel = dto.Settings?.CtaLabel ?? "Submit Feedback",
                CollectContact = dto.Settings?.CollectContact ?? false
            }
        };
    }

    public static void UpdateFromDto(this Campaign campaign, UpdateCampaignDto dto)
    {
        if (!string.IsNullOrEmpty(dto.BusinessName)) campaign.BusinessName = dto.BusinessName;
        if (dto.GoogleReviewUrl != null) campaign.GoogleReviewUrl = dto.GoogleReviewUrl;
        if (dto.LogoUrl != null) campaign.LogoUrl = dto.LogoUrl;
        if (dto.Status.HasValue) campaign.Status = dto.Status.Value;
        if (dto.Placement != null) campaign.Placement = dto.Placement;

        if (dto.Style != null)
        {
            campaign.Style.PrimaryColor = dto.Style.PrimaryColor;
            campaign.Style.FontFamily = dto.Style.FontFamily;
            campaign.Style.LogoStyle = dto.Style.LogoStyle;
            campaign.Style.RatingIconType = dto.Style.RatingIconType;
            campaign.Style.BackgroundStyle = dto.Style.BackgroundStyle;
            campaign.Style.BackgroundImage = dto.Style.BackgroundImage;
            campaign.Style.BackgroundGradient = dto.Style.BackgroundGradient;
            campaign.Style.QrDotColor = dto.Style.QrDotColor;
            campaign.Style.QrFrame = dto.Style.QrFrame;
        }

        if (dto.Settings != null)
        {
            campaign.Settings.RoutingThreshold = dto.Settings.RoutingThreshold;
            campaign.Settings.Heading = dto.Settings.Heading;
            campaign.Settings.CtaLabel = dto.Settings.CtaLabel;
            campaign.Settings.ThankYouMessage = dto.Settings.ThankYouMessage;
            campaign.Settings.CollectContact = dto.Settings.CollectContact;
            campaign.Settings.IncentiveEnabled = dto.Settings.IncentiveEnabled;
            campaign.Settings.IncentiveCoupon = dto.Settings.IncentiveCoupon;
        }

        if (dto.StandeeConfig != null)
        {
            if (campaign.StandeeConfig == null)
            {
                campaign.StandeeConfig = new CampaignStandeeConfig { CampaignId = campaign.Id };
            }
            campaign.StandeeConfig.TemplateId = dto.StandeeConfig.TemplateId;
            campaign.StandeeConfig.CtaText = dto.StandeeConfig.CtaText;
            campaign.StandeeConfig.ShowLogo = dto.StandeeConfig.ShowLogo;
        }
    }
}
