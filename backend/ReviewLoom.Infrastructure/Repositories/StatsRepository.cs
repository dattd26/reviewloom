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

    public async Task<(long Total, long Positive, long Negative)> GetOverallStatsAsync(Guid userId, DateTime startDate, DateTime endDate)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        var endDateExclusive = endDate.Date.AddDays(1);

        var sql = @"
            SELECT 
                COUNT(*) AS total,
                COALESCE(SUM(CASE WHEN s.action = 'positive' THEN 1 ELSE 0 END), 0) AS positive,
                COALESCE(SUM(CASE WHEN s.action = 'negative' THEN 1 ELSE 0 END), 0) AS negative
            FROM scans s
            JOIN campaigns c ON s.campaign_id = c.id
            WHERE c.user_id = @UserId
              AND s.scanned_at >= @StartDate
              AND s.scanned_at < @EndDateExclusive";

        var result = await connection.QueryFirstOrDefaultAsync<dynamic>(sql, new { UserId = userId, StartDate = startDate.Date, EndDateExclusive = endDateExclusive });
        if (result == null) return (0, 0, 0);

        return ((long)(result.total ?? 0), (long)(result.positive ?? 0), (long)(result.negative ?? 0));
    }

    public async Task<IEnumerable<(DateTime Date, long Total, long Positive, long Negative)>> GetScansGrowthAsync(Guid userId, DateTime startDate, DateTime endDate)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        var endDateExclusive = endDate.Date.AddDays(1);

        var sql = @"
            WITH date_range AS (
                SELECT generate_series(CAST(@StartDate AS date), CAST(@EndDate AS date), INTERVAL '1 day')::date AS date
            ),
            daily_scans AS (
                SELECT 
                    DATE(s.scanned_at) AS date,
                    COUNT(*) AS total,
                    COALESCE(SUM(CASE WHEN s.action = 'positive' THEN 1 ELSE 0 END), 0) AS positive,
                    COALESCE(SUM(CASE WHEN s.action = 'negative' THEN 1 ELSE 0 END), 0) AS negative
                FROM scans s
                JOIN campaigns c ON s.campaign_id = c.id
                WHERE c.user_id = @UserId
                  AND s.scanned_at >= @StartDate
                  AND s.scanned_at < @EndDateExclusive
                GROUP BY DATE(s.scanned_at)
            )
            SELECT 
                dr.date,
                COALESCE(ds.total, 0) AS total,
                COALESCE(ds.positive, 0) AS positive,
                COALESCE(ds.negative, 0) AS negative
            FROM date_range dr
            LEFT JOIN daily_scans ds ON ds.date = dr.date
            ORDER BY dr.date ASC";

        var result = await connection.QueryAsync<dynamic>(sql, new { UserId = userId, StartDate = startDate.Date, EndDate = endDate.Date, EndDateExclusive = endDateExclusive });
        return result.Select(r => (
            r.date is DateOnly dateOnly ? dateOnly.ToDateTime(TimeOnly.MinValue) : (DateTime)r.date,
            (long)r.total,
            (long)r.positive,
            (long)r.negative
        )).ToList();
    }

    public async Task<IEnumerable<(Guid Id, string CampaignBusinessName, string Action, int Rating, string? FeedbackName, string? FeedbackMessage, DateTime ScannedAt)>> GetRecentActivityAsync(Guid userId, int limit, DateTime startDate, DateTime endDate)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        var endDateExclusive = endDate.Date.AddDays(1);

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
              AND s.scanned_at >= @StartDate
              AND s.scanned_at < @EndDateExclusive
            ORDER BY s.scanned_at DESC
            LIMIT @Limit";

        var result = await connection.QueryAsync<dynamic>(sql, new { UserId = userId, Limit = limit, StartDate = startDate.Date, EndDateExclusive = endDateExclusive });
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
