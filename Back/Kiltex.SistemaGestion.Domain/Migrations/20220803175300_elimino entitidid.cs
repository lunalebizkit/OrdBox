using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Kiltex.SistemaGestion.Domain.Migrations
{
    public partial class eliminoentitidid : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_product_entity_entitydId",
                table: "product");

            migrationBuilder.RenameColumn(
                name: "entitydId",
                table: "product",
                newName: "entityId");

            migrationBuilder.RenameIndex(
                name: "IX_product_entitydId",
                table: "product",
                newName: "IX_product_entityId");

            migrationBuilder.AlterColumn<string>(
                name: "cuit",
                table: "entity",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_product_entity_entityId",
                table: "product",
                column: "entityId",
                principalTable: "entity",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_product_entity_entityId",
                table: "product");

            migrationBuilder.RenameColumn(
                name: "entityId",
                table: "product",
                newName: "entitydId");

            migrationBuilder.RenameIndex(
                name: "IX_product_entityId",
                table: "product",
                newName: "IX_product_entitydId");

            migrationBuilder.AlterColumn<int>(
                name: "cuit",
                table: "entity",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_product_entity_entitydId",
                table: "product",
                column: "entitydId",
                principalTable: "entity",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
