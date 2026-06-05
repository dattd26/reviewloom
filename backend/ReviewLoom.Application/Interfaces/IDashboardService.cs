using System;
using System.Threading.Tasks;
using ReviewLoom.Application.DTOs;

namespace ReviewLoom.Application.Interfaces;

public interface IDashboardService
{
    Task<DashboardOverviewDto> GetDashboardOverviewAsync(Guid userId);
}
