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

    public async Task<IEnumerable<CampaignDto>> GetAllCampaignsAsync()
    {
        var campaigns = await _unitOfWork.Campaigns.GetAllAsync();
        return campaigns.Select(c => new CampaignDto
        {
            Id = c.Id,
            Slug = c.Slug,
            GoogleReviewUrl = c.GoogleReviewUrl,
            BusinessName = c.BusinessName,
            LogoUrl = c.LogoUrl,
            ThankYouMessage = c.ThankYouMessage,
            CreatedAt = c.CreatedAt
        });
    }

    public async Task<CampaignDto?> GetCampaignByIdAsync(Guid id)
    {
        var c = await _unitOfWork.Campaigns.GetByIdAsync(id);
        if (c == null) return null;

        return new CampaignDto
        {
            Id = c.Id,
            Slug = c.Slug,
            GoogleReviewUrl = c.GoogleReviewUrl,
            BusinessName = c.BusinessName,
            LogoUrl = c.LogoUrl,
            ThankYouMessage = c.ThankYouMessage,
            CreatedAt = c.CreatedAt
        };
    }

    public async Task<CampaignDto?> GetCampaignBySlugAsync(string slug)
    {
        var c = await _unitOfWork.Campaigns.GetBySlugAsync(slug);
        if (c == null) return null;

        return new CampaignDto
        {
            Id = c.Id,
            Slug = c.Slug,
            GoogleReviewUrl = c.GoogleReviewUrl,
            BusinessName = c.BusinessName,
            LogoUrl = c.LogoUrl,
            ThankYouMessage = c.ThankYouMessage,
            CreatedAt = c.CreatedAt
        };
    }

    public async Task<CampaignDto> CreateCampaignAsync(CreateCampaignDto dto, Guid userId)
    {
        var slug = Guid.NewGuid().ToString("N").Substring(0, 8);
        
        var campaign = new Campaign
        {
            UserId = userId,
            Slug = slug,
            BusinessName = dto.BusinessName,
            GoogleReviewUrl = dto.GoogleReviewUrl,
            LogoUrl = dto.LogoUrl,
            ThankYouMessage = "Thank you for your review!",
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.Campaigns.AddAsync(campaign);
        await _unitOfWork.CompleteAsync();

        return new CampaignDto
        {
            Id = campaign.Id,
            Slug = campaign.Slug,
            GoogleReviewUrl = campaign.GoogleReviewUrl,
            BusinessName = campaign.BusinessName,
            LogoUrl = campaign.LogoUrl,
            ThankYouMessage = campaign.ThankYouMessage,
            CreatedAt = campaign.CreatedAt
        };
    }
}
