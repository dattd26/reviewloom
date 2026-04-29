using Microsoft.Extensions.DependencyInjection;
using ReviewLoom.Application.Services;

namespace ReviewLoom.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<ICampaignService, CampaignService>();

        return services;
    }
}
