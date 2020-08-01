using Microsoft.EntityFrameworkCore.Migrations;

namespace FlashGordon.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FCards",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    front = table.Column<string>(unicode: false, maxLength: 250, nullable: false),
                    back = table.Column<string>(unicode: false, maxLength: 500, nullable: false),
                    IsUsed = table.Column<bool>(nullable: false),
                    category = table.Column<string>(unicode: false, maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FCards", x => x.id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FCards");
        }
    }
}
