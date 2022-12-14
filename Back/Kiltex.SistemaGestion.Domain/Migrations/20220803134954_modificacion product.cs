using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Kiltex.SistemaGestion.Domain.Migrations
{
    public partial class modificacionproduct : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "point_order",
                table: "brand");

            migrationBuilder.AddColumn<decimal>(
                name: "card_sale_price",
                table: "product",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "cash_sale_percentage",
                table: "product",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "cash_sale_price",
                table: "product",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<long>(
                name: "entity_id",
                table: "product",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<long>(
                name: "entitydId",
                table: "product",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<string>(
                name: "observation",
                table: "product",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "point_order",
                table: "product",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "purchase_price",
                table: "product",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "quantity",
                table: "product",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "sale_percentage",
                table: "product",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "sale_price",
                table: "product",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateTable(
                name: "entity",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    dni = table.Column<int>(type: "int", nullable: true),
                    cuit = table.Column<int>(type: "int", nullable: true),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    observation = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_entity", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "email_entity",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    entity_id = table.Column<long>(type: "bigint", nullable: false),
                    entitydId = table.Column<long>(type: "bigint", nullable: false),
                    email = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_email_entity", x => x.id);
                    table.ForeignKey(
                        name: "FK_email_entity_entity_entitydId",
                        column: x => x.entitydId,
                        principalTable: "entity",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "phone_entity",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    entity_id = table.Column<long>(type: "bigint", nullable: false),
                    entitydId = table.Column<long>(type: "bigint", nullable: false),
                    phone_number = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_phone_entity", x => x.id);
                    table.ForeignKey(
                        name: "FK_phone_entity_entity_entitydId",
                        column: x => x.entitydId,
                        principalTable: "entity",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_product_entitydId",
                table: "product",
                column: "entitydId");

            migrationBuilder.CreateIndex(
                name: "IX_email_entity_entitydId",
                table: "email_entity",
                column: "entitydId");

            migrationBuilder.CreateIndex(
                name: "IX_phone_entity_entitydId",
                table: "phone_entity",
                column: "entitydId");

            migrationBuilder.AddForeignKey(
                name: "FK_product_entity_entitydId",
                table: "product",
                column: "entitydId",
                principalTable: "entity",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_product_entity_entitydId",
                table: "product");

            migrationBuilder.DropTable(
                name: "email_entity");

            migrationBuilder.DropTable(
                name: "phone_entity");

            migrationBuilder.DropTable(
                name: "entity");

            migrationBuilder.DropIndex(
                name: "IX_product_entitydId",
                table: "product");

            migrationBuilder.DropColumn(
                name: "card_sale_price",
                table: "product");

            migrationBuilder.DropColumn(
                name: "cash_sale_percentage",
                table: "product");

            migrationBuilder.DropColumn(
                name: "cash_sale_price",
                table: "product");

            migrationBuilder.DropColumn(
                name: "entity_id",
                table: "product");

            migrationBuilder.DropColumn(
                name: "entitydId",
                table: "product");

            migrationBuilder.DropColumn(
                name: "observation",
                table: "product");

            migrationBuilder.DropColumn(
                name: "point_order",
                table: "product");

            migrationBuilder.DropColumn(
                name: "purchase_price",
                table: "product");

            migrationBuilder.DropColumn(
                name: "quantity",
                table: "product");

            migrationBuilder.DropColumn(
                name: "sale_percentage",
                table: "product");

            migrationBuilder.DropColumn(
                name: "sale_price",
                table: "product");

            migrationBuilder.AddColumn<int>(
                name: "point_order",
                table: "brand",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
