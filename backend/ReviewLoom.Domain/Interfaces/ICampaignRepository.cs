using ReviewLoom.Domain.Entities;

namespace ReviewLoom.Domain.Interfaces;

public interface ICampaignRepository : IRepository<Campaign>
{
    Task<Campaign?> GetBySlugAsync(string slug);
}
