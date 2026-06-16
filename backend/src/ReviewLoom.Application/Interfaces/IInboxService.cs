using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ReviewLoom.Application.DTOs;

namespace ReviewLoom.Application.Interfaces;

public interface IInboxService
{
    Task<IEnumerable<PrivateFeedbackDto>> GetFeedbackListAsync(Guid userId, Guid? campaignId, string? status, string? search);
    Task<bool> UpdateFeedbackStatusAsync(Guid scanId, Guid userId, string status);
    Task<bool> SendFeedbackReplyAsync(Guid scanId, Guid userId, string replyMessage);
}
