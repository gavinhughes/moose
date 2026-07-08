"use server";

import bcrypt from "bcryptjs";
import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { likes, posts, replies, users } from "@/db/schema";
import { createSession, destroySession, getCurrentUser } from "./auth";

export type FormState =
  | { error?: string; success?: number; username?: string }
  | undefined;

const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;
const MAX_BODY = 500;

export async function signup(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!USERNAME_RE.test(username)) {
    return {
      error: "Username must be 3–20 letters, numbers, or underscores.",
      username,
    };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters.", username };
  }
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(sql`lower(${users.username}) = ${username.toLowerCase()}`);
  if (existing.length > 0) {
    return { error: "That username is taken.", username };
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const [user] = await db
    .insert(users)
    .values({ username, passwordHash })
    .returning({ id: users.id });
  await createSession(user.id);
  redirect("/");
}

export async function login(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const [user] = await db
    .select()
    .from(users)
    .where(sql`lower(${users.username}) = ${username.toLowerCase()}`);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { error: "Invalid username or password.", username };
  }
  await createSession(user.id);
  redirect("/");
}

export async function logout() {
  await destroySession();
  redirect("/");
}

export async function createPost(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const type = formData.get("type");
  const body = String(formData.get("body") ?? "").trim();
  if (type !== "thought" && type !== "question") {
    return { error: "Pick a type." };
  }
  if (!body) {
    return {
      error:
        type === "question"
          ? "Your question is empty."
          : "Your thought is empty.",
    };
  }
  if (body.length > MAX_BODY) {
    return { error: `Keep it under ${MAX_BODY} characters.` };
  }
  await db.insert(posts).values({ userId: user.id, type, body });
  revalidatePath("/");
  return { success: Date.now() };
}

export async function createReply(
  postId: number,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const body = String(formData.get("body") ?? "").trim();
  if (!body) {
    return { error: "Your reply is empty." };
  }
  if (body.length > MAX_BODY) {
    return { error: `Keep it under ${MAX_BODY} characters.` };
  }
  const [post] = await db
    .select({ id: posts.id })
    .from(posts)
    .where(eq(posts.id, postId));
  if (!post) {
    return { error: "This post no longer exists." };
  }
  await db.insert(replies).values({ postId, userId: user.id, body });
  revalidatePath(`/post/${postId}`);
  revalidatePath("/");
  return { success: Date.now() };
}

export async function toggleLike(postId: number) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const where = and(eq(likes.postId, postId), eq(likes.userId, user.id));
  const existing = await db.select().from(likes).where(where);
  if (existing.length > 0) {
    await db.delete(likes).where(where);
  } else {
    await db
      .insert(likes)
      .values({ postId, userId: user.id })
      .onConflictDoNothing();
  }
  revalidatePath("/");
  revalidatePath(`/post/${postId}`);
}
