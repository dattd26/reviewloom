using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ReviewLoom.Domain.Entities;
using ReviewLoom.Domain.Interfaces;
using ReviewLoom.Infrastructure.Data;

namespace ReviewLoom.Infrastructure.Repositories;

public class CampaignRepository : Repository<Campaign>, ICampaignRepository
{
    public CampaignRepository(ReviewLoomDbContext context) : base(context)
    {
    }

    public async Task<Campaign?> GetBySlugAsync(string slug)
    {
        return await Context.Campaigns.FirstOrDefaultAsync(c => c.Slug == slug);
    }
}
