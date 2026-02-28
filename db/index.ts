import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/db/schema/index"; // ✅ import your schema

if (!process.env.NEONDB_URL) {
  throw new Error("NEONDB_URL is not set in environment variables");
}

const pool = new Pool({
  connectionString: process.env.NEONDB_URL,
});

console.log("Loaded DB URL:", process.env.NEONDB_URL);

export const db = drizzle(pool, { schema }); // ✅ include schema
