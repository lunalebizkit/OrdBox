using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Kiltex.SistemaGestion.Domain.Migrations
{
    public partial class updateordersupplierdetails : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "status_id",
                table: "supplier_order_detail",
                newName: "status");

            migrationBuilder.AddColumn<DateTime>(
                name: "dateTime",
                table: "supplier_order",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "scheduled_date",
                table: "supplier_order",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<long>(
                name: "supplier_order_number",
                table: "supplier_order",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "dateTime",
                table: "supplier_order");

            migrationBuilder.DropColumn(
                name: "scheduled_date",
                table: "supplier_order");

            migrationBuilder.DropColumn(
                name: "supplier_order_number",
                table: "supplier_order");

            migrationBuilder.RenameColumn(
                name: "status",
                table: "supplier_order_detail",
                newName: "status_id");
        }
    }
}
