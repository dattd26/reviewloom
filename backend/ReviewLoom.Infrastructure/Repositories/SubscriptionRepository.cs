using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ReviewLoom.Domain.Entities;
using ReviewLoom.Domain.Interfaces;
using ReviewLoom.Infrastructure.Data;

namespace ReviewLoom.Infrastructure.Repositories;

public class SubscriptionRepository : Repository<Subscription>, ISubscriptionRepository
{
    public SubscriptionRepository(ReviewLoomDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Subscription>> GetByUserIdAsync(Guid userId)
    {
        return await Context.Subscriptions
            .Where(s => s.UserId == userId)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();
    }
}
