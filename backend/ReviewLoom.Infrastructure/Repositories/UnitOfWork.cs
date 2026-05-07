using System.Threading.Tasks;
using ReviewLoom.Domain.Interfaces;
using ReviewLoom.Infrastructure.Data;

namespace ReviewLoom.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly ReviewLoomDbContext _context;

    public UnitOfWork(ReviewLoomDbContext context)
    {
        _context = context;
        Campaigns = new CampaignRepository(_context);
        Users = new UserRepository(_context);
        Scans = new ScanRepository(_context);
    }

    public ICampaignRepository Campaigns { get; private set; }
    public IUserRepository Users { get; private set; }
    public IScanRepository Scans { get; private set; }

    public async Task<int> CompleteAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
