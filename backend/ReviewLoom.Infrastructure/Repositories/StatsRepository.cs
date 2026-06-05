using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;
using ReviewLoom.Domain.Interfaces;

namespace ReviewLoom.Infrastructure.Repositories;

public class StatsRepository : IStatsRepository
{
    private readonly string _connectionString;

    public StatsRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection") 
                            ?? throw new InvalidOperationException("DefaultConnection not found");
    }

    public async Task<(long Total, long Positive, long Negative)> GetCampaignStatsAsync(Guid campaignId)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();

        var sql = "SELECT total_scans, positive_scans, negative_scans FROM fn_get_campaign_stats(@CampaignId)";
        
        var result = await connection.QueryFirstOrDefaultAsync(sql, new { CampaignId = campaignId });

        if (result == null) return (0, 0, 0);

        return (result.total_scans ?? 0, result.positive_scans ?? 0, result.negative_scans ?? 0);
    }

    public async Task<(long Total, long Positive, long Negative)> GetOverallStatsAsync(Guid userId)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();

        var sql = @"
            SELECT 
                COUNT(*) AS total,
                COALESCE(SUM(CASE WHEN s.action = 'positive' THEN 1 ELSE 0 END), 0) AS positive,
                COALESCE(SUM(CASE WHEN s.action = 'negative' THEN 1 ELSE 0 END), 0) AS negative
            FROM scans s
            JOIN campaigns c ON s.campaign_id = c.id
            WHERE c.user_id = @UserId";

        var result = await connection.QueryFirstOrDefaultAsync<dynamic>(sql, new { UserId = userId });
        if (result == null) return (0, 0, 0);

        return ((long)(result.total ?? 0), (long)(result.positive ?? 0), (long)(result.negative ?? 0));
    }

    public async Task<IEnumerable<(DateTime Date, long Total, long Positive, long Negative)>> GetScansGrowthAsync(Guid userId, int days)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();

        var sql = @"
            SELECT 
                DATE(s.scanned_at) AS date,
                COUNT(*) AS total,
                COALESCE(SUM(CASE WHEN s.action = 'positive' THEN 1 ELSE 0 END), 0) AS positive,
                COALESCE(SUM(CASE WHEN s.action = 'negative' THEN 1 ELSE 0 END), 0) AS negative
            FROM scans s
            JOIN campaigns c ON s.campaign_id = c.id
            WHERE c.user_id = @UserId AND s.scanned_at >= NOW() - CAST(@Days || ' days' AS INTERVAL)
            GROUP BY DATE(s.scanned_at)
            ORDER BY DATE(s.scanned_at) ASC";

        var result = await connection.QueryAsync<dynamic>(sql, new { UserId = userId, Days = days });
        return result.Select(r => (
            r.date is DateOnly dateOnly ? dateOnly.ToDateTime(TimeOnly.MinValue) : (DateTime)r.date,
            (long)r.total,
            (long)r.positive,
            (long)r.negative
        )).ToList();
    }

    public async Task<IEnumerable<(Guid Id, string CampaignBusinessName, string Action, int Rating, string? FeedbackName, string? FeedbackMessage, DateTime ScannedAt)>> GetRecentActivityAsync(Guid userId, int limit)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();

        var sql = @"
            SELECT 
                s.id,
                c.business_name AS campaign_business_name,
                s.action,
                s.""Rating"" AS rating,
                s.feedback_name AS feedback_name,
                s.feedback_message AS feedback_message,
                s.scanned_at AS scanned_at
            FROM scans s
            JOIN campaigns c ON s.campaign_id = c.id
            WHERE c.user_id = @UserId
            ORDER BY s.scanned_at DESC
            LIMIT @Limit";

        var result = await connection.QueryAsync<dynamic>(sql, new { UserId = userId, Limit = limit });
        return result.Select(r => (
            (Guid)r.id,
            (string)r.campaign_business_name,
            (string)r.action,
            (int)r.rating,
            (string?)r.feedback_name,
            (string?)r.feedback_message,
            (DateTime)r.scanned_at
        )).ToList();
    }
}
