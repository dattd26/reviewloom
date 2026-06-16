using System;
using System.Threading.Tasks;

namespace ReviewLoom.Domain.Interfaces;

public interface IUnitOfWork : IDisposable
{
    ICampaignRepository Campaigns { get; }
    IUserRepository Users { get; }
    IScanRepository Scans { get; }
    ISubscriptionRepository Subscriptions { get; }
    IStandeeTemplateRepository StandeeTemplates { get; }
    Task<int> CompleteAsync();
}
