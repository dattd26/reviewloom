using System.Threading.Tasks;

namespace ReviewLoom.Application.Interfaces;

public interface IEmailService
{
    Task SendEmailAsync(string toEmail, string subject, string body, string replyToEmail, string fromName);
}
