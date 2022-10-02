using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Kiltex.SistemaGestion.Domain.Migrations
{
    public partial class invoiceinvoiceDetail : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "invoice",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    customer_id = table.Column<long>(type: "bigint", nullable: false),
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    invoice_number = table.Column<long>(type: "bigint", nullable: false),
                    customer_name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    customer_cuit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    customer_address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    observation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    dateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    total = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    type = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_invoice", x => x.id);
                    table.ForeignKey(
                        name: "FK_invoice_customer_customer_id",
                        column: x => x.customer_id,
                        principalTable: "customer",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_invoice_user_user_id",
                        column: x => x.user_id,
                        principalTable: "user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "invoice_detail",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    invoice_id = table.Column<long>(type: "bigint", nullable: false),
                    product_id = table.Column<long>(type: "bigint", nullable: false),
                    product_name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    quantity = table.Column<int>(type: "int", nullable: false),
                    price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    iva = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_invoice_detail", x => x.id);
                    table.ForeignKey(
                        name: "FK_invoice_detail_invoice_invoice_id",
                        column: x => x.invoice_id,
                        principalTable: "invoice",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_invoice_detail_product_product_id",
                        column: x => x.product_id,
                        principalTable: "product",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_invoice_customer_id",
                table: "invoice",
                column: "customer_id");

            migrationBuilder.CreateIndex(
                name: "IX_invoice_user_id",
                table: "invoice",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_invoice_detail_invoice_id",
                table: "invoice_detail",
                column: "invoice_id");

            migrationBuilder.CreateIndex(
                name: "IX_invoice_detail_product_id",
                table: "invoice_detail",
                column: "product_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "invoice_detail");

            migrationBuilder.DropTable(
                name: "invoice");
        }
    }
}
