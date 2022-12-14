using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Kiltex.SistemaGestion.Domain.Migrations
{
    public partial class modificacionphone : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_email_entity_entity_entitydId",
                table: "email_entity");

            migrationBuilder.DropForeignKey(
                name: "FK_phone_entity_entity_entitydId",
                table: "phone_entity");

            migrationBuilder.DropIndex(
                name: "IX_phone_entity_entitydId",
                table: "phone_entity");

            migrationBuilder.DropIndex(
                name: "IX_email_entity_entitydId",
                table: "email_entity");

            migrationBuilder.DropColumn(
                name: "entitydId",
                table: "phone_entity");

            migrationBuilder.DropColumn(
                name: "entitydId",
                table: "email_entity");

            migrationBuilder.CreateIndex(
                name: "IX_phone_entity_entity_id",
                table: "phone_entity",
                column: "entity_id");

            migrationBuilder.CreateIndex(
                name: "IX_email_entity_entity_id",
                table: "email_entity",
                column: "entity_id");

            migrationBuilder.AddForeignKey(
                name: "FK_email_entity_entity_entity_id",
                table: "email_entity",
                column: "entity_id",
                principalTable: "entity",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_phone_entity_entity_entity_id",
                table: "phone_entity",
                column: "entity_id",
                principalTable: "entity",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_email_entity_entity_entity_id",
                table: "email_entity");

            migrationBuilder.DropForeignKey(
                name: "FK_phone_entity_entity_entity_id",
                table: "phone_entity");

            migrationBuilder.DropIndex(
                name: "IX_phone_entity_entity_id",
                table: "phone_entity");

            migrationBuilder.DropIndex(
                name: "IX_email_entity_entity_id",
                table: "email_entity");

            migrationBuilder.AddColumn<long>(
                name: "entitydId",
                table: "phone_entity",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<long>(
                name: "entitydId",
                table: "email_entity",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateIndex(
                name: "IX_phone_entity_entitydId",
                table: "phone_entity",
                column: "entitydId");

            migrationBuilder.CreateIndex(
                name: "IX_email_entity_entitydId",
                table: "email_entity",
                column: "entitydId");

            migrationBuilder.AddForeignKey(
                name: "FK_email_entity_entity_entitydId",
                table: "email_entity",
                column: "entitydId",
                principalTable: "entity",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_phone_entity_entity_entitydId",
                table: "phone_entity",
                column: "entitydId",
                principalTable: "entity",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
