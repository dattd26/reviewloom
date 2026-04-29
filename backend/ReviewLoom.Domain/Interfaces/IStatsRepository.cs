using System;
using System.Threading.Tasks;

namespace ReviewLoom.Domain.Interfaces;

public interface IStatsRepository
{
    Task<(long Total, long Positive, long Negative)> GetCampaignStatsAsync(Guid campaignId);
}
