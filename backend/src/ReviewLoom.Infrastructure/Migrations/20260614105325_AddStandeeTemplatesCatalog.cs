using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ReviewLoom.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddStandeeTemplatesCatalog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "standee_templates",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    category = table.Column<string>(type: "text", nullable: false),
                    is_premium = table.Column<bool>(type: "boolean", nullable: false),
                    thumbnail_url = table.Column<string>(type: "text", nullable: false),
                    schema_json = table.Column<string>(type: "jsonb", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("standee_templates_pkey", x => x.id);
                });

            migrationBuilder.InsertData(
                table: "standee_templates",
                columns: new[] { "id", "category", "is_premium", "name", "schema_json", "thumbnail_url" },
                values: new object[,]
                {
                    { "cafe_kraft", "coffee", false, "Cafe Kraft", "{\"layout\": \"cafe_kraft\", \"editableFields\": [\"logo\", \"businessName\", \"ctaText\", \"qrCode\"]}", "" },
                    { "coffee-cozy", "coffee", false, "Cozy Cafe", "{\"layout\": \"coffee-cozy\", \"editableFields\": [\"logo\", \"businessName\", \"ctaText\", \"qrCode\"]}", "" },
                    { "coffee-minimal", "coffee", false, "Minimal Coffee", "{\"layout\": \"coffee-minimal\", \"editableFields\": [\"logo\", \"businessName\", \"ctaText\", \"qrCode\"]}", "" },
                    { "coffee-premium", "coffee", true, "Premium Coffee", "{\"layout\": \"coffee-premium\", \"editableFields\": [\"logo\", \"businessName\", \"ctaText\", \"qrCode\"]}", "" },
                    { "minimal_white", "general", false, "Minimal White", "{\"layout\": \"minimal_white\", \"editableFields\": [\"logo\", \"businessName\", \"ctaText\", \"qrCode\"]}", "" },
                    { "prestige_dark", "general", true, "Prestige Dark", "{\"layout\": \"prestige_dark\", \"editableFields\": [\"logo\", \"businessName\", \"ctaText\", \"qrCode\"]}", "" },
                    { "restaurant-casual", "restaurant", false, "Fast Casual", "{\"layout\": \"restaurant-casual\", \"editableFields\": [\"logo\", \"businessName\", \"ctaText\", \"qrCode\"]}", "" },
                    { "restaurant-elegant", "restaurant", true, "Elegant Dining", "{\"layout\": \"restaurant-elegant\", \"editableFields\": [\"logo\", \"businessName\", \"ctaText\", \"qrCode\"]}", "" },
                    { "restaurant-modern", "restaurant", false, "Modern Table", "{\"layout\": \"restaurant-modern\", \"editableFields\": [\"logo\", \"businessName\", \"ctaText\", \"qrCode\"]}", "" },
                    { "salon_blush", "salon", true, "Salon Blush", "{\"layout\": \"salon_blush\", \"editableFields\": [\"logo\", \"businessName\", \"ctaText\", \"qrCode\"]}", "" },
                    { "salon-barber", "salon", false, "Modern Barber", "{\"layout\": \"salon-barber\", \"editableFields\": [\"logo\", \"businessName\", \"ctaText\", \"qrCode\"]}", "" },
                    { "salon-luxury", "salon", true, "Luxury Spa", "{\"layout\": \"salon-luxury\", \"editableFields\": [\"logo\", \"businessName\", \"ctaText\", \"qrCode\"]}", "" },
                    { "salon-minimal", "salon", false, "Beauty Minimal", "{\"layout\": \"salon-minimal\", \"editableFields\": [\"logo\", \"businessName\", \"ctaText\", \"qrCode\"]}", "" },
                    { "services-hvac", "services", false, "HVAC Trust", "{\"layout\": \"services-hvac\", \"editableFields\": [\"logo\", \"businessName\", \"ctaText\", \"qrCode\"]}", "" },
                    { "services-plumbing", "services", true, "Plumbing Expert", "{\"layout\": \"services-plumbing\", \"editableFields\": [\"logo\", \"businessName\", \"ctaText\", \"qrCode\"]}", "" },
                    { "services-roofing", "services", false, "Roofing Pro", "{\"layout\": \"services-roofing\", \"editableFields\": [\"logo\", \"businessName\", \"ctaText\", \"qrCode\"]}", "" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_campaign_standee_configs_template_id",
                table: "campaign_standee_configs",
                column: "template_id");

            migrationBuilder.AddForeignKey(
                name: "campaign_standee_configs_template_id_fkey",
                table: "campaign_standee_configs",
                column: "template_id",
                principalTable: "standee_templates",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "campaign_standee_configs_template_id_fkey",
                table: "campaign_standee_configs");

            migrationBuilder.DropTable(
                name: "standee_templates");

            migrationBuilder.DropIndex(
                name: "IX_campaign_standee_configs_template_id",
                table: "campaign_standee_configs");
        }
    }
}
