using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReviewLoom.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddStatusAndReplyToScans : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "replied_at",
                table: "scans",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "reply_message",
                table: "scans",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "status",
                table: "scans",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "unread");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "replied_at",
                table: "scans");

            migrationBuilder.DropColumn(
                name: "reply_message",
                table: "scans");

            migrationBuilder.DropColumn(
                name: "status",
                table: "scans");
        }
    }
}
