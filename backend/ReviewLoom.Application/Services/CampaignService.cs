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

        foreach (var c in campaigns)
        {
            var stats = await _statsRepository.GetCampaignStatsAsync(c.Id);
            dtos.Add(c.ToDto(stats));
        }

        return dtos;
    }

    public async Task<CampaignDto?> GetCampaignByIdAsync(Guid id)
    {
        var campaign = await _unitOfWork.Campaigns.GetFullByIdAsync(id);
        if (campaign == null) return null;

        var stats = await _statsRepository.GetCampaignStatsAsync(id);
        return campaign.ToDto(stats);
    }

    public async Task<CampaignDto?> GetCampaignBySlugAsync(string slug)
    {
        var campaign = await _unitOfWork.Campaigns.GetFullBySlugAsync(slug);
        if (campaign == null) return null;

        var stats = await _statsRepository.GetCampaignStatsAsync(campaign.Id);
        return campaign.ToDto(stats);
    }

    public async Task<CampaignDto> CreateCampaignAsync(CreateCampaignDto dto, Guid userId)
    {
        var slug = GenerateSlug(dto.BusinessName);
        var campaign = dto.CreateEntity(userId, slug);

        await _unitOfWork.Campaigns.AddAsync(campaign);
        await _unitOfWork.CompleteAsync();
        
        return campaign.ToDto((0, 0, 0));
    }

    public async Task<CampaignDto?> UpdateCampaignAsync(Guid id, UpdateCampaignDto dto)
    {
        var campaign = await _unitOfWork.Campaigns.GetFullByIdAsync(id);
        if (campaign == null) return null;

        campaign.UpdateFromDto(dto);

        _unitOfWork.Campaigns.Update(campaign);
        await _unitOfWork.CompleteAsync();

        var stats = await _statsRepository.GetCampaignStatsAsync(id);
        return campaign.ToDto(stats);
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
            dtos.Add(c.ToDto(stats));
        }

        return dtos;
    }

    private string GenerateSlug(string businessName)
    {
        var cleanName = new string(businessName.Where(c => char.IsLetterOrDigit(c) || char.IsWhiteSpace(c)).ToArray());
        var slug = cleanName.ToLower().Trim().Replace(" ", "-");
        return $"{slug}-{Guid.NewGuid().ToString("N").Substring(0, 6)}";
    }
}
