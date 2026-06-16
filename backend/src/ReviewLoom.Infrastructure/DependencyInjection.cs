using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ReviewLoom.Application.Services;
using ReviewLoom.Domain.Interfaces;
using ReviewLoom.Application.Interfaces;
using ReviewLoom.Infrastructure.Data;
using ReviewLoom.Infrastructure.Repositories;
using ReviewLoom.Infrastructure.Services;

namespace ReviewLoom.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ReviewLoomDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IScanRepository, ScanRepository>();
        services.AddScoped<IStatsRepository, StatsRepository>();
        services.AddScoped<ISubscriptionRepository, SubscriptionRepository>();
        services.AddScoped<IStripeService, StripeService>();
        services.AddScoped<IMediaService, CloudinaryMediaService>();
        services.AddScoped<IStandeeTemplateRepository, StandeeTemplateRepository>();

        // Email Services
        services.AddTransient<IEmailService, SmtpEmailService>();
        services.AddSingleton<IEmailQueue, EmailQueue>();
        services.AddHostedService<EmailBackgroundService>();

        return services;
    }
}
