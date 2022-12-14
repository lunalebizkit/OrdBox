using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Kiltex.SistemaGestion.Domain.Migrations
{
    public partial class agregofkbrandenproduct : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "brand_id",
                table: "product",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateIndex(
                name: "IX_product_brand_id",
                table: "product",
                column: "brand_id");

            migrationBuilder.AddForeignKey(
                name: "FK_product_brand_brand_id",
                table: "product",
                column: "brand_id",
                principalTable: "brand",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_product_brand_brand_id",
                table: "product");

            migrationBuilder.DropIndex(
                name: "IX_product_brand_id",
                table: "product");

            migrationBuilder.DropColumn(
                name: "brand_id",
                table: "product");
        }
    }
}
