using System;
using System.Threading.Tasks;

namespace ReviewLoom.Domain.Interfaces;

public interface IUnitOfWork : IDisposable
{
    ICampaignRepository Campaigns { get; }
    Task<int> CompleteAsync();
}
