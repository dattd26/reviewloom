using System;
using System.Threading.Tasks;
using ReviewLoom.Application.Interfaces;
using ReviewLoom.Domain.Entities;
using ReviewLoom.Domain.Interfaces;

namespace ReviewLoom.Application.Services;

public class UserService : IUserService
{
    private readonly IUnitOfWork _unitOfWork;

    public UserService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid?> GetUserIdByClerkIdAsync(string clerkId)
    {
        var user = await _unitOfWork.Users.GetByClerkIdAsync(clerkId);
        return user?.Id;
    }

    public async Task CreateUserAsync(string clerkId, string email, string? firstName)
    {
        var existingUser = await _unitOfWork.Users.GetByClerkIdAsync(clerkId);
        if (existingUser == null)
        {
            var newUser = new User
            {
                Id = Guid.NewGuid(),
                ClerkId = clerkId,
                Email = email,
                CreatedAt = DateTime.UtcNow,
                BusinessName = firstName
            };

            await _unitOfWork.Users.AddAsync(newUser);
            await _unitOfWork.CompleteAsync();
        }
    }

    public async Task DeleteUserAsync(string clerkId)
    {
        var existingUser = await _unitOfWork.Users.GetByClerkIdAsync(clerkId);
        if (existingUser != null)
        {
            _unitOfWork.Users.Remove(existingUser);
            await _unitOfWork.CompleteAsync();
        }
    }
}
