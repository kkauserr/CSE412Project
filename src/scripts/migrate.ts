import { query } from "@/lib/db";
import fs from "fs";
import path from "path";

async function runMigration() {
  try {
    // First check if we can connect to the database
    await query("SELECT 1");
    console.log("✓ Database connection successful");

    const migrationPath = path.join(
      process.cwd(),
      "src/db/migrations/add_pet_image_url.sql"
    );
    console.log(`Reading migration from ${migrationPath}`);

    const migrationSql = fs.readFileSync(migrationPath, "utf8");
    console.log("Migration SQL loaded successfully");

    console.log("Running migration...");
    await query(migrationSql);
    console.log("✓ Migration completed successfully");

    // Verify the columns were added
    const columns = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'pet' AND column_name IN ('type', 'image_url')
    `);
    console.log("Verified columns:", columns);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

console.log("Starting database migration...");
runMigration();
