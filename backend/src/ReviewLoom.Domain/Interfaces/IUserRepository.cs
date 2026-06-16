using System.Threading.Tasks;
using ReviewLoom.Domain.Entities;

namespace ReviewLoom.Domain.Interfaces;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByClerkIdAsync(string clerkId);
}
