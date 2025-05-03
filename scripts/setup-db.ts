import { config } from "dotenv";
import { Pool } from "pg";
import { readFileSync } from "fs";
import { join } from "path";

// Load environment variables
config();

async function setupDatabase() {
  const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
    database: process.env.POSTGRES_DB,
  });

  try {
    // Read the initialization SQL
    const initSql = readFileSync(join(__dirname, "init.sql"), "utf-8");

    // Execute the entire SQL file at once
    try {
      await pool.query(initSql);
      console.log("Database initialized successfully");
    } catch (error: any) {
      if (error.code === "58P01" && error.message.includes("postgis")) {
        console.warn(
          "Warning: PostGIS extension not available. Location-based features will be limited."
        );
        // Try again without PostGIS
        const sqlWithoutPostgis = initSql.replace(
          /CREATE EXTENSION IF NOT EXISTS postgis;/g,
          "-- PostGIS not available\n"
        );
        await pool.query(sqlWithoutPostgis);
        console.log("Database initialized successfully (without PostGIS)");
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the setup if this file is executed directly
if (require.main === module) {
  setupDatabase().catch((error) => {
    console.error("Failed to set up database:", error);
    process.exit(1);
  });
}
