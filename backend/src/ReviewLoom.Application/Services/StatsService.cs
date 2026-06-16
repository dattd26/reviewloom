using System;
using System.Threading.Tasks;
using ReviewLoom.Application.DTOs;
using ReviewLoom.Domain.Interfaces;
using ReviewLoom.Application.Interfaces;

namespace ReviewLoom.Application.Services;

public class StatsService : IStatsService
{
    private readonly IStatsRepository _statsRepository;

    public StatsService(IStatsRepository statsRepository)
    {
        _statsRepository = statsRepository;
    }

    public async Task<CampaignStatsDto> GetCampaignStatsAsync(Guid campaignId)
    {
        var result = await _statsRepository.GetCampaignStatsAsync(campaignId);
        
        return new CampaignStatsDto
        {
            TotalScans = result.Total,
            PositiveScans = result.Positive,
            NegativeScans = result.Negative
        };
    }
}
