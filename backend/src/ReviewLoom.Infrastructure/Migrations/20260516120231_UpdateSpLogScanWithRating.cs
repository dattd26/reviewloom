using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReviewLoom.Infrastructure.Migrations
{
    public partial class UpdateSpLogScanWithRating : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                CREATE OR REPLACE PROCEDURE sp_log_scan(
                    p_campaign_id UUID,
                    p_action VARCHAR,
                    p_rating INT,
                    p_feedback_name TEXT,
                    p_feedback_email TEXT,
                    p_feedback_message TEXT
                )
                LANGUAGE plpgsql
                AS $$
                BEGIN
                    INSERT INTO scans (campaign_id, action, ""Rating"", feedback_name, feedback_email, feedback_message)
                    VALUES (p_campaign_id, p_action, p_rating, p_feedback_name, p_feedback_email, p_feedback_message);
                END;
                $$;
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                CREATE OR REPLACE PROCEDURE sp_log_scan(
                    p_campaign_id UUID,
                    p_action VARCHAR,
                    p_feedback_name TEXT,
                    p_feedback_email TEXT,
                    p_feedback_message TEXT
                )
                LANGUAGE plpgsql
                AS $$
                BEGIN
                    INSERT INTO scans (campaign_id, action, feedback_name, feedback_email, feedback_message)
                    VALUES (p_campaign_id, p_action, p_feedback_name, p_feedback_email, p_feedback_message);
                END;
                $$;
            ");
        }
    }
}
