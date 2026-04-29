using System;
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
}
