using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ReviewLoom.Domain.Entities;
using ReviewLoom.Domain.Interfaces;
using ReviewLoom.Infrastructure.Data;

namespace ReviewLoom.Infrastructure.Repositories;

public class UserRepository : Repository<User>, IUserRepository
{
    private readonly ReviewLoomDbContext _context;

    public UserRepository(ReviewLoomDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<User?> GetByClerkIdAsync(string clerkId)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.ClerkId == clerkId);
    }
}
