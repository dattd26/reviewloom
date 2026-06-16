using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using ReviewLoom.Application.Interfaces;

namespace ReviewLoom.Infrastructure.Services;

public class EmailBackgroundService : BackgroundService
{
    private readonly IEmailQueue _emailQueue;
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly ILogger<EmailBackgroundService> _logger;

    public EmailBackgroundService(
        IEmailQueue emailQueue,
        IServiceScopeFactory serviceScopeFactory,
        ILogger<EmailBackgroundService> logger)
    {
        _emailQueue = emailQueue;
        _serviceScopeFactory = serviceScopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Email Background Service is starting.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var message = await _emailQueue.DequeueEmailAsync(stoppingToken);

                _logger.LogInformation("Processing email message from queue to {ToEmail}.", message.ToEmail);

                _ = Task.Run(async () =>
                {
                    try
                    {
                        using var scope = _serviceScopeFactory.CreateScope();
                        var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

                        await emailService.SendEmailAsync(
                            message.ToEmail,
                            message.Subject,
                            message.Body,
                            message.ReplyToEmail,
                            message.FromName
                        );
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error occurred while sending email in background task for {ToEmail}.", message.ToEmail);
                    }
                }, stoppingToken);
            }
            catch (OperationCanceledException)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred in Email Background Service loop.");
                await Task.Delay(5000, stoppingToken);
            }
        }

        _logger.LogInformation("Email Background Service is stopping.");
    }
}
