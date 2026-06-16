using Microsoft.Extensions.DependencyInjection;
using ReviewLoom.Application.Services;
using ReviewLoom.Application.Interfaces;

namespace ReviewLoom.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<ICampaignService, CampaignService>();
        services.AddScoped<IScanService, ScanService>();
        services.AddScoped<IStatsService, StatsService>();
        services.AddScoped<IDashboardService, DashboardService>();
        services.AddScoped<IInboxService, InboxService>();
        services.AddScoped<IBillingOverviewService, BillingOverviewService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IStandeeTemplateService, StandeeTemplateService>();

        return services;
    }
}
