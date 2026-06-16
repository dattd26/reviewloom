using System;
using System.Collections.Generic;
using System.Linq;
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

    public async Task<Campaign?> GetFullByIdAsync(Guid id)
    {
        return await Context.Campaigns
            .Include(c => c.Style)
            .Include(c => c.Settings)
            .Include(c => c.StandeeConfig)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Campaign?> GetFullBySlugAsync(string slug)
    {
        return await Context.Campaigns
            .Include(c => c.Style)
            .Include(c => c.Settings)
            .Include(c => c.StandeeConfig)
            .FirstOrDefaultAsync(c => c.Slug == slug);
    }

    public async Task<IEnumerable<Campaign>> GetByUserIdAsync(Guid userId)
    {
        return await Context.Campaigns
            .Where(c => c.UserId == userId)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }
}
