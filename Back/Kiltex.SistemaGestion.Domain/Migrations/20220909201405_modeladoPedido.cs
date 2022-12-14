using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Kiltex.SistemaGestion.Domain.Migrations
{
    public partial class modeladoPedido : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "supplier_order",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    supplier_id = table.Column<long>(type: "bigint", nullable: false),
                    is_paid = table.Column<bool>(type: "bit", nullable: false),
                    status_id = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_supplier_order", x => x.id);
                    table.ForeignKey(
                        name: "FK_supplier_order_supplier_supplier_id",
                        column: x => x.supplier_id,
                        principalTable: "supplier",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "supplier_order_detail",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    product_id = table.Column<long>(type: "bigint", nullable: false),
                    supplier_order_id = table.Column<long>(type: "bigint", nullable: false),
                    ordered_quantity = table.Column<int>(type: "int", nullable: false),
                    recieved_quantity = table.Column<int>(type: "int", nullable: false),
                    status_id = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_supplier_order_detail", x => x.id);
                    table.ForeignKey(
                        name: "FK_supplier_order_detail_product_product_id",
                        column: x => x.product_id,
                        principalTable: "product",
                        principalColumn: "id",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_supplier_order_detail_supplier_order_supplier_order_id",
                        column: x => x.supplier_order_id,
                        principalTable: "supplier_order",
                        principalColumn: "id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateIndex(
                name: "IX_supplier_order_supplier_id",
                table: "supplier_order",
                column: "supplier_id");

            migrationBuilder.CreateIndex(
                name: "IX_supplier_order_detail_product_id",
                table: "supplier_order_detail",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "IX_supplier_order_detail_supplier_order_id",
                table: "supplier_order_detail",
                column: "supplier_order_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "supplier_order_detail");

            migrationBuilder.DropTable(
                name: "supplier_order");
        }
    }
}
