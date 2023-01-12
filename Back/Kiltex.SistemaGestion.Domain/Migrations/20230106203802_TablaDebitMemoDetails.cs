using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Kiltex.SistemaGestion.Domain.Migrations
{
    public partial class TablaDebitMemoDetails : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "conc_no_gravado",
                table: "debit_memo",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "iva_total",
                table: "debit_memo",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "observation",
                table: "debit_memo",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "perc_ing_brutos",
                table: "debit_memo",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "perc_iva",
                table: "debit_memo",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "receipt_number",
                table: "debit_memo",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "supplier_address",
                table: "debit_memo",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "supplier_cuit",
                table: "debit_memo",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "supplier_id",
                table: "debit_memo",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<string>(
                name: "supplier_name",
                table: "debit_memo",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "total",
                table: "debit_memo",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "type",
                table: "debit_memo",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<long>(
                name: "user_id",
                table: "debit_memo",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateTable(
                name: "debit_memo_details",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    product_id = table.Column<long>(type: "bigint", nullable: false),
                    product_name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    product_code = table.Column<int>(type: "int", nullable: false),
                    quantity = table.Column<int>(type: "int", nullable: false),
                    price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    iva = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    debit_memo_id = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_debit_memo_details", x => x.id);
                    table.ForeignKey(
                        name: "FK_debit_memo_details_debit_memo_debit_memo_id",
                        column: x => x.debit_memo_id,
                        principalTable: "debit_memo",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_debit_memo_details_product_product_id",
                        column: x => x.product_id,
                        principalTable: "product",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_debit_memo_supplier_id",
                table: "debit_memo",
                column: "supplier_id");

            migrationBuilder.CreateIndex(
                name: "IX_debit_memo_user_id",
                table: "debit_memo",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_debit_memo_details_debit_memo_id",
                table: "debit_memo_details",
                column: "debit_memo_id");

            migrationBuilder.CreateIndex(
                name: "IX_debit_memo_details_product_id",
                table: "debit_memo_details",
                column: "product_id");

            migrationBuilder.AddForeignKey(
                name: "FK_debit_memo_supplier_supplier_id",
                table: "debit_memo",
                column: "supplier_id",
                principalTable: "supplier",
                principalColumn: "id",
                onDelete: ReferentialAction.NoAction);

            migrationBuilder.AddForeignKey(
                name: "FK_debit_memo_user_user_id",
                table: "debit_memo",
                column: "user_id",
                principalTable: "user",
                principalColumn: "id",
                onDelete: ReferentialAction.NoAction);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_debit_memo_supplier_supplier_id",
                table: "debit_memo");

            migrationBuilder.DropForeignKey(
                name: "FK_debit_memo_user_user_id",
                table: "debit_memo");

            migrationBuilder.DropTable(
                name: "debit_memo_details");

            migrationBuilder.DropIndex(
                name: "IX_debit_memo_supplier_id",
                table: "debit_memo");

            migrationBuilder.DropIndex(
                name: "IX_debit_memo_user_id",
                table: "debit_memo");

            migrationBuilder.DropColumn(
                name: "conc_no_gravado",
                table: "debit_memo");

            migrationBuilder.DropColumn(
                name: "iva_total",
                table: "debit_memo");

            migrationBuilder.DropColumn(
                name: "observation",
                table: "debit_memo");

            migrationBuilder.DropColumn(
                name: "perc_ing_brutos",
                table: "debit_memo");

            migrationBuilder.DropColumn(
                name: "perc_iva",
                table: "debit_memo");

            migrationBuilder.DropColumn(
                name: "receipt_number",
                table: "debit_memo");

            migrationBuilder.DropColumn(
                name: "supplier_address",
                table: "debit_memo");

            migrationBuilder.DropColumn(
                name: "supplier_cuit",
                table: "debit_memo");

            migrationBuilder.DropColumn(
                name: "supplier_id",
                table: "debit_memo");

            migrationBuilder.DropColumn(
                name: "supplier_name",
                table: "debit_memo");

            migrationBuilder.DropColumn(
                name: "total",
                table: "debit_memo");

            migrationBuilder.DropColumn(
                name: "type",
                table: "debit_memo");

            migrationBuilder.DropColumn(
                name: "user_id",
                table: "debit_memo");
        }
    }
}
