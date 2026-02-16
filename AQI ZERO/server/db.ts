import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "@shared/schema";

// Use SQLite for local development - no PostgreSQL needed!
const sqlite = new Database("./aqi_zero.db");
export const db = drizzle(sqlite, { schema });

// Keep pool export for compatibility, but it won't be used
export const pool = null;
