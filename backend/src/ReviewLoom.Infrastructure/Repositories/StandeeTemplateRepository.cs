using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ReviewLoom.Domain.Entities;
using ReviewLoom.Domain.Interfaces;
using ReviewLoom.Infrastructure.Data;

namespace ReviewLoom.Infrastructure.Repositories;

public class StandeeTemplateRepository : Repository<StandeeTemplate>, IStandeeTemplateRepository
{
    public StandeeTemplateRepository(ReviewLoomDbContext context) : base(context)
    {
    }

    public async Task<StandeeTemplate?> GetByIdAsync(string id)
    {
        return await Context.StandeeTemplates.FindAsync(id);
    }
}
