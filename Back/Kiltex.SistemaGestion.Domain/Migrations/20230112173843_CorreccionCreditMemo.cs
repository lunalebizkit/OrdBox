using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Kiltex.SistemaGestion.Domain.Migrations
{
    public partial class CorreccionCreditMemo : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.CreateTable(
                name: "credit_memo",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    customer_id = table.Column<long>(type: "bigint", nullable: false),
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    creditMemo_number = table.Column<long>(type: "bigint", nullable: false),
                    customer_name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    customer_cuit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    customer_address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    observation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    dateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    total = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    iva_total = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    type = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_credit_memo", x => x.id);
                    table.ForeignKey(
                        name: "FK_credit_memo_customer_customer_id",
                        column: x => x.customer_id,
                        principalTable: "customer",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_credit_memo_user_user_id",
                        column: x => x.user_id,
                        principalTable: "user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "credit_memo_details",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    credit_id = table.Column<long>(type: "bigint", nullable: false),
                    product_id = table.Column<long>(type: "bigint", nullable: false),
                    product_name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    product_code = table.Column<int>(type: "int", nullable: false),
                    quantity = table.Column<int>(type: "int", nullable: false),
                    price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    iva = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_credit_memo_details", x => x.id);
                    table.ForeignKey(
                        name: "FK_credit_memo_details_credit_memo_credit_id",
                        column: x => x.credit_id,
                        principalTable: "credit_memo",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_credit_memo_details_product_product_id",
                        column: x => x.product_id,
                        principalTable: "product",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });




            migrationBuilder.CreateIndex(
                name: "IX_credit_memo_customer_id",
                table: "credit_memo",
                column: "customer_id");

            migrationBuilder.CreateIndex(
                name: "IX_credit_memo_user_id",
                table: "credit_memo",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_credit_memo_details_credit_id",
                table: "credit_memo_details",
                column: "credit_id");

            migrationBuilder.CreateIndex(
                name: "IX_credit_memo_details_product_id",
                table: "credit_memo_details",
                column: "product_id");

        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "credit_memo_details");

            migrationBuilder.DropTable(
                name: "debit_memo_details");
         

            migrationBuilder.DropTable(
                name: "credit_memo");

            migrationBuilder.DropTable(
                name: "debit_memo");



        }
    }
}
