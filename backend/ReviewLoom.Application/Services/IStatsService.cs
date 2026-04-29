using System;
using System.Threading.Tasks;
using ReviewLoom.Application.DTOs;

namespace ReviewLoom.Application.Services;

public interface IStatsService
{
    Task<CampaignStatsDto> GetCampaignStatsAsync(Guid campaignId);
}
