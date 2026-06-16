using System;
using System.Threading.Tasks;

namespace ReviewLoom.Application.Interfaces;

public interface IUserService
{
    Task<Guid?> GetUserIdByClerkIdAsync(string clerkId);
    Task CreateUserAsync(string clerkId, string email, string? firstName);
    Task DeleteUserAsync(string clerkId);
}
