import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import * as schema from "./schema";

// Reuse the connection across dev hot-reloads.
const globalForDb = globalThis as unknown as { sqlite?: Database.Database };

// Idempotent bootstrap so a fresh database (dev or a new production
// volume) works without a separate migration step. Keep in sync with
// schema.ts.
const BOOTSTRAP_DDL = `
create table if not exists users (
  id integer primary key autoincrement,
  username text not null unique,
  password_hash text not null,
  created_at integer not null
);
create table if not exists sessions (
  token text primary key,
  user_id integer not null references users(id),
  expires_at integer not null
);
create table if not exists posts (
  id integer primary key autoincrement,
  user_id integer not null references users(id),
  type text not null,
  body text not null,
  created_at integer not null
);
create table if not exists replies (
  id integer primary key autoincrement,
  post_id integer not null references posts(id),
  user_id integer not null references users(id),
  body text not null,
  created_at integer not null
);
create table if not exists likes (
  post_id integer not null references posts(id),
  user_id integer not null references users(id),
  primary key (post_id, user_id)
);
`;

function createConnection() {
  const dataDir = process.env.DATA_DIR ?? path.join(process.cwd(), "data");
  fs.mkdirSync(dataDir, { recursive: true });
  const sqlite = new Database(path.join(dataDir, "app.db"));
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  sqlite.exec(BOOTSTRAP_DDL);
  return sqlite;
}

const sqlite = globalForDb.sqlite ?? createConnection();
if (process.env.NODE_ENV !== "production") globalForDb.sqlite = sqlite;

export const db = drizzle(sqlite, { schema });
