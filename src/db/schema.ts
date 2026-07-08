import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const sessions = sqliteTable("sessions", {
  token: text("token").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
});

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  type: text("type", { enum: ["thought", "question"] }).notNull(),
  body: text("body").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const replies = sqliteTable("replies", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  postId: integer("post_id")
    .notNull()
    .references(() => posts.id),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  body: text("body").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const likes = sqliteTable(
  "likes",
  {
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
  },
  (t) => [primaryKey({ columns: [t.postId, t.userId] })],
);

export type PostType = "thought" | "question";
