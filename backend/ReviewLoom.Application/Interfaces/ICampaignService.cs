using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ReviewLoom.Application.DTOs;

namespace ReviewLoom.Application.Interfaces;

public interface ICampaignService
{
    Task<CampaignDto?> GetCampaignByIdAsync(Guid id);
    Task<CampaignDto?> GetCampaignBySlugAsync(string slug);
    Task<IEnumerable<CampaignDto>> GetUserCampaignsAsync(Guid userId);
    Task<CampaignDto> CreateCampaignAsync(CreateCampaignDto dto, Guid userId);
    Task<CampaignDto?> UpdateCampaignAsync(Guid id, UpdateCampaignDto dto);
    Task<bool> DeleteCampaignAsync(Guid id);
}
