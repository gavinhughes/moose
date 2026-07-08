import { and, desc, eq, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { posts, users, type PostType } from "@/db/schema";

export type FeedPost = {
  id: number;
  type: PostType;
  body: string;
  createdAt: Date;
  username: string;
  replyCount: number;
  likeCount: number;
  likedByMe: number;
};

export async function fetchPosts(opts: {
  currentUserId: number | null;
  filter?: PostType;
  username?: string;
  postId?: number;
  limit: number;
}): Promise<FeedPost[]> {
  const conditions: SQL[] = [];
  if (opts.filter) conditions.push(eq(posts.type, opts.filter));
  if (opts.username) conditions.push(eq(users.username, opts.username));
  if (opts.postId !== undefined) conditions.push(eq(posts.id, opts.postId));

  return db
    .select({
      id: posts.id,
      type: posts.type,
      body: posts.body,
      createdAt: posts.createdAt,
      username: users.username,
      replyCount: sql<number>`(select count(*) from replies where replies.post_id = ${posts.id})`,
      likeCount: sql<number>`(select count(*) from likes where likes.post_id = ${posts.id})`,
      likedByMe:
        opts.currentUserId === null
          ? sql<number>`0`
          : sql<number>`exists(select 1 from likes where likes.post_id = ${posts.id} and likes.user_id = ${opts.currentUserId})`,
    })
    .from(posts)
    .innerJoin(users, eq(users.id, posts.userId))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(posts.id))
    .limit(opts.limit);
}
