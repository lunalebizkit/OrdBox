using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Kiltex.SistemaGestion.Domain.Migrations
{
    public partial class TableDebitMemo : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "debit_memo",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    receipt_id = table.Column<long>(type: "bigint", nullable: false),
                    dateTime = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_debit_memo", x => x.id);
                    table.ForeignKey(
                        name: "FK_debit_memo_receipt_receipt_id",
                        column: x => x.receipt_id,
                        principalTable: "receipt",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_debit_memo_receipt_id",
                table: "debit_memo",
                column: "receipt_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "debit_memo");
        }
    }
}
