using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Kiltex.SistemaGestion.Domain.Migrations
{
    public partial class AddTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_product_entity_entity_id",
                table: "product");

            migrationBuilder.AddForeignKey(
                name: "FK_product_supplier_entity_id",
                table: "product",
                column: "entity_id",
                principalTable: "supplier",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_product_supplier_entity_id",
                table: "product");

            migrationBuilder.AddForeignKey(
                name: "FK_product_entity_entity_id",
                table: "product",
                column: "entity_id",
                principalTable: "entity",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
