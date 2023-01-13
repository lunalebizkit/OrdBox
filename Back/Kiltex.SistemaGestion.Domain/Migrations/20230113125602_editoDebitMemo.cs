using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Kiltex.SistemaGestion.Domain.Migrations
{
    public partial class editoDebitMemo : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_debit_memo_invoice_invoice_id",
                table: "debit_memo");

            migrationBuilder.AlterColumn<long>(
                name: "invoice_id",
                table: "debit_memo",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AddForeignKey(
                name: "FK_debit_memo_invoice_invoice_id",
                table: "debit_memo",
                column: "invoice_id",
                principalTable: "invoice",
                principalColumn: "id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_debit_memo_invoice_invoice_id",
                table: "debit_memo");

            migrationBuilder.AlterColumn<long>(
                name: "invoice_id",
                table: "debit_memo",
                type: "bigint",
                nullable: false,
                defaultValue: 0L,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_debit_memo_invoice_invoice_id",
                table: "debit_memo",
                column: "invoice_id",
                principalTable: "invoice",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
