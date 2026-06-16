using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReviewLoom.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCampaignStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "google_review_url",
                table: "campaigns",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<int>(
                name: "status",
                table: "campaigns",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "status",
                table: "campaigns");

            migrationBuilder.AlterColumn<string>(
                name: "google_review_url",
                table: "campaigns",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);
        }
    }
}
