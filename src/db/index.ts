import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import * as schema from "./schema";

// Reuse the connection across dev hot-reloads.
const globalForDb = globalThis as unknown as { sqlite?: Database.Database };

function createConnection() {
  const dataDir = path.join(process.cwd(), "data");
  fs.mkdirSync(dataDir, { recursive: true });
  const sqlite = new Database(path.join(dataDir, "app.db"));
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  return sqlite;
}

const sqlite = globalForDb.sqlite ?? createConnection();
if (process.env.NODE_ENV !== "production") globalForDb.sqlite = sqlite;

export const db = drizzle(sqlite, { schema });
