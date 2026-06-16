using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using ReviewLoom.Domain.Entities;
using ReviewLoom.Domain.Interfaces;
using ReviewLoom.Infrastructure.Data;

namespace ReviewLoom.Infrastructure.Repositories;

public class ScanRepository : Repository<Scan>, IScanRepository
{
    private readonly ReviewLoomDbContext _context;

    public ScanRepository(ReviewLoomDbContext context) : base(context)
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

    public async Task<IEnumerable<(Guid Id, Guid CampaignId, string CampaignBusinessName, int Rating, string? FeedbackName, string? FeedbackEmail, string? FeedbackMessage, DateTime ScannedAt, string Status, string? ReplyMessage, DateTime? RepliedAt)>> GetPrivateFeedbackListAsync(Guid userId, Guid? campaignId, string? status, string? search)
    {
        var sql = @"
            SELECT 
                s.id,
                s.campaign_id AS campaign_id,
                c.business_name AS campaign_business_name,
                s.""Rating"" AS rating,
                s.feedback_name AS feedback_name,
                s.feedback_email AS feedback_email,
                s.feedback_message AS feedback_message,
                s.scanned_at AS scanned_at,
                s.status,
                s.reply_message,
                s.replied_at
            FROM scans s
            JOIN campaigns c ON s.campaign_id = c.id
            WHERE c.user_id = @UserId AND s.action = 'negative'";

        var parameters = new DynamicParameters();
        parameters.Add("UserId", userId);

        if (campaignId.HasValue)
        {
            sql += " AND s.campaign_id = @CampaignId";
            parameters.Add("CampaignId", campaignId.Value);
        }

        if (!string.IsNullOrEmpty(status) && status != "all")
        {
            sql += " AND s.status = @Status";
            parameters.Add("Status", status);
        }

        if (!string.IsNullOrEmpty(search))
        {
            sql += " AND (s.feedback_name ILIKE @Search OR s.feedback_email ILIKE @Search OR s.feedback_message ILIKE @Search)";
            parameters.Add("Search", $"%{search}%");
        }

        sql += " ORDER BY s.scanned_at DESC";

        using var connection = _context.Database.GetDbConnection();
        var result = await connection.QueryAsync<dynamic>(sql, parameters);

        return result.Select(r => (
            (Guid)r.id,
            (Guid)r.campaign_id,
            (string)r.campaign_business_name,
            (int)r.rating,
            (string?)r.feedback_name,
            (string?)r.feedback_email,
            (string?)r.feedback_message,
            (DateTime)r.scanned_at,
            (string)r.status,
            (string?)r.reply_message,
            (DateTime?)r.replied_at
        )).ToList();
    }
}
