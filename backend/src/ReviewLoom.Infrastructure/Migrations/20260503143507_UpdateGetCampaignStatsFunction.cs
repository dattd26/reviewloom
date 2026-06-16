using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReviewLoom.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateGetCampaignStatsFunction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                CREATE OR REPLACE FUNCTION fn_get_campaign_stats(p_campaign_id UUID)
                RETURNS TABLE (
                    total_scans BIGINT,
                    positive_scans BIGINT,
                    negative_scans BIGINT
                )
                LANGUAGE plpgsql
                AS $$
                BEGIN
                    RETURN QUERY
                    SELECT 
                        COUNT(*) AS total_scans,
                        COALESCE(SUM(CASE WHEN action = 'positive' THEN 1 ELSE 0 END), 0) AS positive_scans,
                        COALESCE(SUM(CASE WHEN action = 'negative' THEN 1 ELSE 0 END), 0) AS negative_scans
                    FROM scans
                    WHERE campaign_id = p_campaign_id;
                END;
                $$;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
