using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReviewLoom.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddNormalizedCampaignTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            /*
            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    clerk_id = table.Column<string>(type: "text", nullable: false),
                    email = table.Column<string>(type: "text", nullable: false),
                    business_name = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("users_pkey", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "campaigns",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    slug = table.Column<string>(type: "text", nullable: false),
                    google_review_url = table.Column<string>(type: "text", nullable: false),
                    business_name = table.Column<string>(type: "text", nullable: false),
                    logo_url = table.Column<string>(type: "text", nullable: true),
                    thank_you_message = table.Column<string>(type: "text", nullable: true, defaultValueSql: "'Thank you for your review!'::text"),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("campaigns_pkey", x => x.id);
                    table.ForeignKey(
                        name: "campaigns_user_id_fkey",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "subscriptions",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    payment_provider = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    provider_customer_id = table.Column<string>(type: "text", nullable: false),
                    provider_subscription_id = table.Column<string>(type: "text", nullable: false),
                    plan_id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    current_period_end = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("subscriptions_pkey", x => x.id);
                    table.ForeignKey(
                        name: "subscriptions_user_id_fkey",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });
            */

            migrationBuilder.CreateTable(
                name: "campaign_settings",
                columns: table => new
                {
                    campaign_id = table.Column<Guid>(type: "uuid", nullable: false),
                    routing_threshold = table.Column<int>(type: "integer", nullable: false, defaultValue: 4),
                    heading = table.Column<string>(type: "text", nullable: false, defaultValue: "How was your experience?"),
                    cta_label = table.Column<string>(type: "text", nullable: false, defaultValue: "Submit Feedback"),
                    thank_you_message = table.Column<string>(type: "text", nullable: true),
                    collect_contact = table.Column<bool>(type: "boolean", nullable: false),
                    incentive_enabled = table.Column<bool>(type: "boolean", nullable: false),
                    incentive_coupon = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("campaign_settings_pkey", x => x.campaign_id);
                    table.ForeignKey(
                        name: "FK_campaign_settings_campaigns_campaign_id",
                        column: x => x.campaign_id,
                        principalTable: "campaigns",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "campaign_standee_configs",
                columns: table => new
                {
                    campaign_id = table.Column<Guid>(type: "uuid", nullable: false),
                    template_id = table.Column<string>(type: "text", nullable: false, defaultValue: "minimal_white"),
                    cta_text = table.Column<string>(type: "text", nullable: true),
                    show_logo = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("campaign_standee_configs_pkey", x => x.campaign_id);
                    table.ForeignKey(
                        name: "FK_campaign_standee_configs_campaigns_campaign_id",
                        column: x => x.campaign_id,
                        principalTable: "campaigns",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "campaign_styles",
                columns: table => new
                {
                    campaign_id = table.Column<Guid>(type: "uuid", nullable: false),
                    primary_color = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false, defaultValue: "#0037b0"),
                    font_family = table.Column<string>(type: "text", nullable: false, defaultValue: "Manrope"),
                    logo_style = table.Column<string>(type: "text", nullable: false, defaultValue: "soft"),
                    rating_icon_type = table.Column<string>(type: "text", nullable: false, defaultValue: "stars"),
                    background_style = table.Column<string>(type: "text", nullable: false, defaultValue: "none"),
                    background_image = table.Column<string>(type: "text", nullable: true),
                    background_gradient = table.Column<string>(type: "text", nullable: true),
                    qr_dot_color = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false, defaultValue: "#000000"),
                    qr_frame = table.Column<string>(type: "text", nullable: false, defaultValue: "none")
                },
                constraints: table =>
                {
                    table.PrimaryKey("campaign_styles_pkey", x => x.campaign_id);
                    table.ForeignKey(
                        name: "FK_campaign_styles_campaigns_campaign_id",
                        column: x => x.campaign_id,
                        principalTable: "campaigns",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            /*
            migrationBuilder.CreateTable(
                name: "scans",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    campaign_id = table.Column<Guid>(type: "uuid", nullable: false),
                    action = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    feedback_name = table.Column<string>(type: "text", nullable: true),
                    feedback_email = table.Column<string>(type: "text", nullable: true),
                    feedback_message = table.Column<string>(type: "text", nullable: true),
                    scanned_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("scans_pkey", x => x.id);
                    table.ForeignKey(
                        name: "scans_campaign_id_fkey",
                        column: x => x.campaign_id,
                        principalTable: "campaigns",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });
            */

            /*
            migrationBuilder.CreateIndex(
                name: "campaigns_slug_key",
                table: "campaigns",
                column: "slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_campaigns_user_id",
                table: "campaigns",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_scans_campaign_id",
                table: "scans",
                column: "campaign_id");

            migrationBuilder.CreateIndex(
                name: "IX_subscriptions_user_id",
                table: "subscriptions",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "users_clerk_id_key",
                table: "users",
                column: "clerk_id",
                unique: true);
            */
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "campaign_settings");

            migrationBuilder.DropTable(
                name: "campaign_standee_configs");

            migrationBuilder.DropTable(
                name: "campaign_styles");

            /*
            migrationBuilder.DropTable(
                name: "scans");

            migrationBuilder.DropTable(
                name: "subscriptions");

            migrationBuilder.DropTable(
                name: "campaigns");

            migrationBuilder.DropTable(
                name: "users");
            */
        }
    }
}
