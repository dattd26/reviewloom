using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ReviewLoom.Application.DTOs;
using ReviewLoom.Domain.Entities;
using ReviewLoom.Domain.Interfaces;

namespace ReviewLoom.Application.Services;

public class CampaignService : ICampaignService
{
    private readonly IUnitOfWork _unitOfWork;

    public CampaignService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<CampaignDto>> GetUserCampaignsAsync(Guid userId)
    {
        var campaigns = await _unitOfWork.Campaigns.GetByUserIdAsync(userId);
        return campaigns.Select(MapToDto);
    }

    public async Task<CampaignDto?> GetCampaignByIdAsync(Guid id)
    {
        var campaign = await _unitOfWork.Campaigns.GetFullByIdAsync(id);
        return campaign == null ? null : MapToDto(campaign);
    }

    public async Task<CampaignDto?> GetCampaignBySlugAsync(string slug)
    {
        var campaign = await _unitOfWork.Campaigns.GetFullBySlugAsync(slug);
        return campaign == null ? null : MapToDto(campaign);
    }

    public async Task<CampaignDto> CreateCampaignAsync(CreateCampaignDto dto, Guid userId)
    {
        var slug = GenerateSlug(dto.BusinessName);
        
        var campaign = new Campaign
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Slug = slug,
            BusinessName = dto.BusinessName,
            GoogleReviewUrl = dto.GoogleReviewUrl,
            LogoUrl = dto.LogoUrl,
            CreatedAt = DateTime.UtcNow,
            
            // Initialize sub-components
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

        await _unitOfWork.Campaigns.AddAsync(campaign);
        await _unitOfWork.CompleteAsync();

        return MapToDto(campaign);
    }

    public async Task<CampaignDto?> UpdateCampaignAsync(Guid id, UpdateCampaignDto dto)
    {
        var campaign = await _unitOfWork.Campaigns.GetFullByIdAsync(id);
        if (campaign == null) return null;

        // Update core fields
        if (!string.IsNullOrEmpty(dto.BusinessName)) campaign.BusinessName = dto.BusinessName;
        if (!string.IsNullOrEmpty(dto.GoogleReviewUrl)) campaign.GoogleReviewUrl = dto.GoogleReviewUrl;
        if (dto.LogoUrl != null) campaign.LogoUrl = dto.LogoUrl;

        // Update Style
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

        // Update Settings
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

        // Update Standee Config (Upsert)
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

        _unitOfWork.Campaigns.Update(campaign);
        await _unitOfWork.CompleteAsync();

        return MapToDto(campaign);
    }

    public async Task<bool> DeleteCampaignAsync(Guid id)
    {
        var campaign = await _unitOfWork.Campaigns.GetByIdAsync(id);
        if (campaign == null) return false;

        _unitOfWork.Campaigns.Remove(campaign);
        await _unitOfWork.CompleteAsync();
        return true;
    }

    public async Task<IEnumerable<CampaignDto>> GetAllCampaignsAsync()
    {
        var campaigns = await _unitOfWork.Campaigns.GetAllAsync();
        return campaigns.Select(MapToDto);
    }

    private string GenerateSlug(string businessName)
    {
        var cleanName = new string(businessName.Where(c => char.IsLetterOrDigit(c) || char.IsWhiteSpace(c)).ToArray());
        var slug = cleanName.ToLower().Trim().Replace(" ", "-");
        return $"{slug}-{Guid.NewGuid().ToString("N").Substring(0, 6)}";
    }

    private CampaignDto MapToDto(Campaign c)
    {
        return new CampaignDto
        {
            Id = c.Id,
            Slug = c.Slug,
            BusinessName = c.BusinessName,
            GoogleReviewUrl = c.GoogleReviewUrl,
            LogoUrl = c.LogoUrl,
            CreatedAt = c.CreatedAt,
            Style = c.Style == null ? new CampaignStyleDto() : new CampaignStyleDto
            {
                PrimaryColor = c.Style.PrimaryColor,
                FontFamily = c.Style.FontFamily,
                LogoStyle = c.Style.LogoStyle,
                RatingIconType = c.Style.RatingIconType,
                BackgroundStyle = c.Style.BackgroundStyle,
                BackgroundImage = c.Style.BackgroundImage,
                BackgroundGradient = c.Style.BackgroundGradient,
                QrDotColor = c.Style.QrDotColor,
                QrFrame = c.Style.QrFrame
            },
            Settings = c.Settings == null ? new CampaignSettingsDto() : new CampaignSettingsDto
            {
                RoutingThreshold = c.Settings.RoutingThreshold,
                Heading = c.Settings.Heading,
                CtaLabel = c.Settings.CtaLabel,
                ThankYouMessage = c.Settings.ThankYouMessage,
                CollectContact = c.Settings.CollectContact,
                IncentiveEnabled = c.Settings.IncentiveEnabled,
                IncentiveCoupon = c.Settings.IncentiveCoupon
            },
            StandeeConfig = c.StandeeConfig == null ? null : new CampaignStandeeConfigDto
            {
                TemplateId = c.StandeeConfig.TemplateId,
                CtaText = c.StandeeConfig.CtaText,
                ShowLogo = c.StandeeConfig.ShowLogo
            }
        };
    }
}
