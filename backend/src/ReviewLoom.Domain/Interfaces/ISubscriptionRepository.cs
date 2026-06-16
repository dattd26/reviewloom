using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ReviewLoom.Domain.Entities;

namespace ReviewLoom.Domain.Interfaces;

public interface ISubscriptionRepository : IRepository<Subscription>
{
    Task<IEnumerable<Subscription>> GetByUserIdAsync(Guid userId);
    Task<Subscription?> GetByProviderSubscriptionIdAsync(string providerSubscriptionId);
    Task<Subscription?> GetLatestByProviderCustomerIdAsync(string providerCustomerId);
}
