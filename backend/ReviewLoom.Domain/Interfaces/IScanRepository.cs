using System;
using System.Threading.Tasks;

namespace ReviewLoom.Domain.Interfaces;

public interface IScanRepository
{
    Task LogScanAsync(Guid campaignId, string action, string? feedbackName, string? feedbackEmail, string? feedbackMessage);
}
