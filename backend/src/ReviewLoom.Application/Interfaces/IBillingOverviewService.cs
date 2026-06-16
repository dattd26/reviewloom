using System;
using System.Threading.Tasks;
using ReviewLoom.Application.DTOs;

namespace ReviewLoom.Application.Interfaces;

public interface IBillingOverviewService
{
    Task<SubscriptionOverviewDto> GetBillingOverviewAsync(Guid userId);
}
