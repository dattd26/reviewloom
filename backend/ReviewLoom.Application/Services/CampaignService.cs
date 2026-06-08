using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ReviewLoom.Application.DTOs;
using ReviewLoom.Application.Interfaces;
using ReviewLoom.Application.Mappings;
using ReviewLoom.Domain.Entities;
using ReviewLoom.Domain.Interfaces;

namespace ReviewLoom.Application.Services;

public class CampaignService : ICampaignService
{
    private static readonly HashSet<string> ProStandeeTemplateIds = new(StringComparer.OrdinalIgnoreCase)
    {
        "prestige_dark",
        "salon_blush"
    };

    private readonly IUnitOfWork _unitOfWork;
    private readonly IStatsRepository _statsRepository;

    public CampaignService(IUnitOfWork unitOfWork, IStatsRepository statsRepository)
    {
        _unitOfWork = unitOfWork;
        _statsRepository = statsRepository;
    }

    public async Task<IEnumerable<CampaignDto>> GetUserCampaignsAsync(Guid userId)
    {
        var campaigns = await _unitOfWork.Campaigns.GetByUserIdAsync(userId);
        var dtos = new List<CampaignDto>();
        bool showWatermark = await GetShowWatermarkAsync(userId);

        foreach (var c in campaigns)
        {
            var stats = await _statsRepository.GetCampaignStatsAsync(c.Id);
            dtos.Add(c.ToDto(stats, showWatermark));
        }

        return dtos;
    }

    public async Task<CampaignDto?> GetCampaignByIdAsync(Guid id)
    {
        var campaign = await _unitOfWork.Campaigns.GetFullByIdAsync(id);
        if (campaign == null) return null;

        var stats = await _statsRepository.GetCampaignStatsAsync(id);
        bool showWatermark = await GetShowWatermarkAsync(campaign.UserId);
        return campaign.ToDto(stats, showWatermark);
    }

    public async Task<CampaignDto?> GetCampaignBySlugAsync(string slug)
    {
        var campaign = await _unitOfWork.Campaigns.GetFullBySlugAsync(slug);
        if (campaign == null) return null;

        var stats = await _statsRepository.GetCampaignStatsAsync(campaign.Id);
        bool showWatermark = await GetShowWatermarkAsync(campaign.UserId);
        return campaign.ToDto(stats, showWatermark);
    }

    public async Task<PublicCampaignDto?> GetPublicCampaignBySlugAsync(string slug)
    {
        var campaignEntity = await _unitOfWork.Campaigns.GetBySlugAsync(slug);
        if (campaignEntity == null || campaignEntity.Status != ReviewLoom.Domain.Enums.CampaignStatus.Published)
            return null;

        var campaign = await GetCampaignBySlugAsync(slug);
        if (campaign == null)
            return null;

        var subscriptions = await _unitOfWork.Subscriptions.GetByUserIdAsync(campaignEntity.UserId);
        bool isPro = HasProSubscription(subscriptions);

        return new PublicCampaignDto
        {
            BusinessName = campaign.BusinessName,
            LogoUrl = campaign.LogoUrl,
            GoogleReviewUrl = campaign.GoogleReviewUrl,
            Style = campaign.Style,
            Settings = campaign.Settings,
            ShowWatermark = !isPro
        };
    }

    public async Task<CampaignDto> CreateCampaignAsync(CreateCampaignDto dto, Guid userId)
    {
        var subscriptions = await _unitOfWork.Subscriptions.GetByUserIdAsync(userId);
        bool isPro = HasProSubscription(subscriptions);
        bool showWatermark = !isPro;

        if (!isPro)
        {
            var userCampaigns = await _unitOfWork.Campaigns.GetByUserIdAsync(userId);
            var activeCampaigns = userCampaigns.Count(c => c.Status != Domain.Enums.CampaignStatus.Archived);
            if (activeCampaigns >= 3)
            {
                throw new InvalidOperationException("Free plan limits active campaigns to 3. Upgrade to Pro to create unlimited campaigns.");
            }
        }

        var slug = GenerateSlug(dto.BusinessName);
        var campaign = dto.CreateEntity(userId, slug);

        await _unitOfWork.Campaigns.AddAsync(campaign);
        await _unitOfWork.CompleteAsync();
        
        return campaign.ToDto((0, 0, 0), showWatermark);
    }

    public async Task<CampaignDto?> UpdateCampaignAsync(Guid id, UpdateCampaignDto dto)
    {
        var campaign = await _unitOfWork.Campaigns.GetFullByIdAsync(id);
        if (campaign == null) return null;

        if (dto.StandeeConfig != null && ProStandeeTemplateIds.Contains(dto.StandeeConfig.TemplateId))
        {
            var subscriptions = await _unitOfWork.Subscriptions.GetByUserIdAsync(campaign.UserId);
            if (!HasProSubscription(subscriptions))
            {
                throw new InvalidOperationException("This standee template requires a Pro subscription.");
            }
        }

        campaign.UpdateFromDto(dto);

        _unitOfWork.Campaigns.Update(campaign);
        await _unitOfWork.CompleteAsync();

        var stats = await _statsRepository.GetCampaignStatsAsync(id);
        bool showWatermark = await GetShowWatermarkAsync(campaign.UserId);
        return campaign.ToDto(stats, showWatermark);
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
        var dtos = new List<CampaignDto>();

        foreach (var c in campaigns)
        {
            var stats = await _statsRepository.GetCampaignStatsAsync(c.Id);
            bool showWatermark = await GetShowWatermarkAsync(c.UserId);
            dtos.Add(c.ToDto(stats, showWatermark));
        }

        return dtos;
    }

    private async Task<bool> GetShowWatermarkAsync(Guid userId)
    {
        var subscriptions = await _unitOfWork.Subscriptions.GetByUserIdAsync(userId);
        return !HasProSubscription(subscriptions);
    }

    private static bool HasProSubscription(IEnumerable<Subscription> subscriptions)
    {
        return subscriptions.Any(s =>
            (s.Status == "active" || s.Status == "trialing") &&
            !string.IsNullOrWhiteSpace(s.PlanId));
    }

    private string GenerateSlug(string businessName)
    {
        var cleanName = new string(businessName.Where(c => char.IsLetterOrDigit(c) || char.IsWhiteSpace(c)).ToArray());
        var slug = cleanName.ToLower().Trim().Replace(" ", "-");
        return $"{slug}-{Guid.NewGuid().ToString("N").Substring(0, 6)}";
    }
}
