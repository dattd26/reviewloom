using System;
using System.Data;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;
using ReviewLoom.Domain.Interfaces;

namespace ReviewLoom.Infrastructure.Repositories;

public class ScanRepository : IScanRepository
{
    private readonly string _connectionString;

    public ScanRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection") 
                            ?? throw new InvalidOperationException("DefaultConnection not found");
    }

    public async Task LogScanAsync(Guid campaignId, string action, string? feedbackName, string? feedbackEmail, string? feedbackMessage)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();

        // Using the stored procedure defined in schema.sql
        var sql = "CALL sp_log_scan(@CampaignId, @Action, @FeedbackName, @FeedbackEmail, @FeedbackMessage)";
        
        await connection.ExecuteAsync(sql, new
        {
            CampaignId = campaignId,
            Action = action,
            FeedbackName = feedbackName,
            FeedbackEmail = feedbackEmail,
            FeedbackMessage = feedbackMessage
        });
    }
}
