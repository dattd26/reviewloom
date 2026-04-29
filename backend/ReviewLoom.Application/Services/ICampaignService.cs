using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ReviewLoom.Application.DTOs;

namespace ReviewLoom.Application.Services;

public interface ICampaignService
{
    Task<CampaignDto?> GetCampaignByIdAsync(Guid id);
    Task<IEnumerable<CampaignDto>> GetAllCampaignsAsync();
    Task<CampaignDto> CreateCampaignAsync(CreateCampaignDto dto, Guid userId);
    Task<CampaignDto?> GetCampaignBySlugAsync(string slug);
}
