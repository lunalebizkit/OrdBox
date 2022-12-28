using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Kiltex.SistemaGestion.Domain.Migrations
{
    public partial class IngresosBrutosInvoice : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "conc_no_gravado",
                table: "invoice",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "perc_ing_brutos",
                table: "invoice",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "perc_iva",
                table: "invoice",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "conc_no_gravado",
                table: "invoice");

            migrationBuilder.DropColumn(
                name: "perc_ing_brutos",
                table: "invoice");

            migrationBuilder.DropColumn(
                name: "perc_iva",
                table: "invoice");
        }
    }
}
