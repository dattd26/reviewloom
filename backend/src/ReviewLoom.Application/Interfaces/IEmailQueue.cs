using System.Threading;
using System.Threading.Tasks;

namespace ReviewLoom.Application.Interfaces;

public record EmailMessage(
    string ToEmail,
    string Subject,
    string Body,
    string ReplyToEmail,
    string FromName
);

public interface IEmailQueue
{
    ValueTask QueueEmailAsync(EmailMessage message);
    ValueTask<EmailMessage> DequeueEmailAsync(CancellationToken cancellationToken);
}
