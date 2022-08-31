using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Kiltex.SistemaGestion.Domain.Migrations
{
    public partial class observationSupplier : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "observation",
                table: "entity");

            migrationBuilder.AddColumn<string>(
                name: "observation",
                table: "supplier",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "observation",
                table: "supplier");

            migrationBuilder.AddColumn<string>(
                name: "observation",
                table: "entity",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
