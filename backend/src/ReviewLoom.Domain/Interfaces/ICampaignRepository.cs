using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ReviewLoom.Domain.Entities;

namespace ReviewLoom.Domain.Interfaces;

public interface ICampaignRepository : IRepository<Campaign>
{
    Task<Campaign?> GetBySlugAsync(string slug);
    Task<Campaign?> GetFullByIdAsync(Guid id);
    Task<Campaign?> GetFullBySlugAsync(string slug);
    Task<IEnumerable<Campaign>> GetByUserIdAsync(Guid userId);
}
