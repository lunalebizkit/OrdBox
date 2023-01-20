using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Kiltex.SistemaGestion.Domain.Migrations
{
    public partial class editoCreditMemo : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_invoice_customer_customer_id",
                table: "invoice");

            migrationBuilder.AlterColumn<long>(
                name: "customer_id",
                table: "invoice",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AddColumn<long>(
                name: "invoice_id",
                table: "credit_memo",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "invoice_number",
                table: "credit_memo",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateIndex(
                name: "IX_credit_memo_invoice_id",
                table: "credit_memo",
                column: "invoice_id");

            migrationBuilder.AddForeignKey(
                name: "FK_credit_memo_invoice_invoice_id",
                table: "credit_memo",
                column: "invoice_id",
                principalTable: "invoice",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_invoice_customer_customer_id",
                table: "invoice",
                column: "customer_id",
                principalTable: "customer",
                principalColumn: "id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_credit_memo_invoice_invoice_id",
                table: "credit_memo");

            migrationBuilder.DropForeignKey(
                name: "FK_invoice_customer_customer_id",
                table: "invoice");

            migrationBuilder.DropIndex(
                name: "IX_credit_memo_invoice_id",
                table: "credit_memo");

            migrationBuilder.DropColumn(
                name: "invoice_id",
                table: "credit_memo");

            migrationBuilder.DropColumn(
                name: "invoice_number",
                table: "credit_memo");

            migrationBuilder.AlterColumn<long>(
                name: "customer_id",
                table: "invoice",
                type: "bigint",
                nullable: false,
                defaultValue: 0L,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_invoice_customer_customer_id",
                table: "invoice",
                column: "customer_id",
                principalTable: "customer",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
