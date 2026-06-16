using System.Threading;
using System.Threading.Channels;
using System.Threading.Tasks;
using ReviewLoom.Application.Interfaces;

namespace ReviewLoom.Infrastructure.Services;

public class EmailQueue : IEmailQueue
{
    private readonly Channel<EmailMessage> _channel;

    public EmailQueue()
    {
        _channel = Channel.CreateUnbounded<EmailMessage>(new UnboundedChannelOptions
        {
            SingleReader = true
        });
    }

    public async ValueTask QueueEmailAsync(EmailMessage message)
    {
        await _channel.Writer.WriteAsync(message);
    }

    public async ValueTask<EmailMessage> DequeueEmailAsync(CancellationToken cancellationToken)
    {
        return await _channel.Reader.ReadAsync(cancellationToken);
    }
}
