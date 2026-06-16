using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NSubstitute;
using ReviewLoom.Infrastructure.Services;
using Xunit;

namespace ReviewLoom.Infrastructure.Tests.Services;

public class SmtpEmailServiceTests
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<SmtpEmailService> _logger;
    private readonly SmtpEmailService _emailService;

    public SmtpEmailServiceTests()
    {
        // Mock dependencies using NSubstitute
        _configuration = Substitute.For<IConfiguration>();
        _logger = Substitute.For<ILogger<SmtpEmailService>>();
        
        // Instantiate the system under test (SUT)
        _emailService = new SmtpEmailService(_configuration, _logger);
    }

    [Fact]
    public async Task SendEmailAsync_ShouldLogWarningAndReturn_WhenSmtpHostIsMissing()
    {
        // Arrange
        // We set up IConfiguration to return null for Smtp:Host
        _configuration["Smtp:Host"].Returns((string?)null);
        _configuration["Smtp:Port"].Returns("587");

        var toEmail = "test@example.com";
        var subject = "Test Subject";
        var body = "<h1>Test Body</h1>";
        var replyToEmail = "reply@example.com";
        var fromName = "ReviewLoom Test";

        // Act
        await _emailService.SendEmailAsync(toEmail, subject, body, replyToEmail, fromName);

        // Assert
        // Verify that a warning was logged
        _logger.ReceivedWithAnyArgs(1).Log(
            LogLevel.Warning,
            Arg.Any<EventId>(),
            Arg.Any<object>(),
            Arg.Any<Exception>(),
            Arg.Any<Func<object, Exception?, string>>());
    }

    [Fact]
    public async Task SendEmailAsync_ShouldLogWarningAndReturn_WhenSmtpPortIsInvalid()
    {
        // Arrange
        _configuration["Smtp:Host"].Returns("smtp.gmail.com");
        _configuration["Smtp:Port"].Returns("invalid_port"); // non-numeric

        var toEmail = "test@example.com";
        var subject = "Test Subject";
        var body = "<h1>Test Body</h1>";
        var replyToEmail = "reply@example.com";
        var fromName = "ReviewLoom Test";

        // Act
        await _emailService.SendEmailAsync(toEmail, subject, body, replyToEmail, fromName);

        // Assert
        _logger.ReceivedWithAnyArgs(1).Log(
            LogLevel.Warning,
            Arg.Any<EventId>(),
            Arg.Any<object>(),
            Arg.Any<Exception>(),
            Arg.Any<Func<object, Exception?, string>>());
    }
}
