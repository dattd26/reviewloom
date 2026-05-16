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

    public async Task LogScanAsync(Guid campaignId, string action, int rating, string? feedbackName, string? feedbackEmail, string? feedbackMessage)
    {
        // Using Dapper for stored procedure execution for better performance and parameter handling
        var sql = "CALL sp_log_scan(@CampaignId, @Action, @Rating, @FeedbackName, @FeedbackEmail, @FeedbackMessage)";

        using var connection = _context.Database.GetDbConnection();
        await connection.ExecuteAsync(sql, new
        {
            CampaignId = campaignId,
            Action = action,
            Rating = rating,
            FeedbackName = feedbackName,
            FeedbackEmail = feedbackEmail,
            FeedbackMessage = feedbackMessage
        });
    }
}
