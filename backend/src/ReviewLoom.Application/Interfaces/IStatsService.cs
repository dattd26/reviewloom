using System;
using System.Threading.Tasks;
using ReviewLoom.Application.DTOs;

namespace ReviewLoom.Application.Interfaces;

public interface IStatsService
{
    Task<CampaignStatsDto> GetCampaignStatsAsync(Guid campaignId);
}
