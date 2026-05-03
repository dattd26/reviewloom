using System;
using System.Data;
using System.Threading.Tasks;
using Dapper;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using ReviewLoom.Domain.Interfaces;
using ReviewLoom.Infrastructure.Data;

namespace ReviewLoom.Infrastructure.Repositories;

public class ScanRepository : IScanRepository
{
    private readonly ReviewLoomDbContext _context;

    public ScanRepository(ReviewLoomDbContext context)
    {
        _context = context;
    }

    public async Task LogScanAsync(Guid campaignId, string action, string? feedbackName, string? feedbackEmail, string? feedbackMessage)
    {

        // Using the stored procedure defined in schema.sql
        var sql = "CALL sp_log_scan(@CampaignId, @Action, @FeedbackName, @FeedbackEmail, @FeedbackMessage)";

        await _context.Database.ExecuteSqlRawAsync(sql, new
        {
            CampaignId = campaignId,
            Action = action,
            FeedbackName = feedbackName,
            FeedbackEmail = feedbackEmail,
            FeedbackMessage = feedbackMessage
        });

        await _context.SaveChangesAsync();
    }
}
