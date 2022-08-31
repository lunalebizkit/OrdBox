using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Kiltex.SistemaGestion.Domain.Migrations
{
    public partial class modificoentidadId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_product_entity_entityId",
                table: "product");

            migrationBuilder.DropIndex(
                name: "IX_product_entityId",
                table: "product");

            migrationBuilder.DropColumn(
                name: "entityId",
                table: "product");

            migrationBuilder.CreateIndex(
                name: "IX_product_entity_id",
                table: "product",
                column: "entity_id");

            migrationBuilder.AddForeignKey(
                name: "FK_product_entity_entity_id",
                table: "product",
                column: "entity_id",
                principalTable: "entity",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_product_entity_entity_id",
                table: "product");

            migrationBuilder.DropIndex(
                name: "IX_product_entity_id",
                table: "product");

            migrationBuilder.AddColumn<long>(
                name: "entityId",
                table: "product",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateIndex(
                name: "IX_product_entityId",
                table: "product",
                column: "entityId");

            migrationBuilder.AddForeignKey(
                name: "FK_product_entity_entityId",
                table: "product",
                column: "entityId",
                principalTable: "entity",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
