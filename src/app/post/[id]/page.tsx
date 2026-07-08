import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { Avatar } from "@/components/Avatar";
import { PostCard } from "@/components/PostCard";
import { ReplyForm } from "@/components/ReplyForm";
import { db } from "@/db";
import { replies, users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { timeAgo } from "@/lib/format";
import { fetchPosts } from "@/lib/queries";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id < 1) notFound();

  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const [post] = await fetchPosts({
    currentUserId: user.id,
    postId: id,
    limit: 1,
  });
  if (!post) notFound();

  const replyRows = await db
    .select({
      id: replies.id,
      body: replies.body,
      createdAt: replies.createdAt,
      username: users.username,
    })
    .from(replies)
    .innerJoin(users, eq(users.id, replies.userId))
    .where(eq(replies.postId, id))
    .orderBy(replies.id);

  const isQuestion = post.type === "question";

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/"
        className="flex min-h-11 items-center gap-1 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        ← Back to the feed
      </Link>

      <PostCard post={post} detail />

      <ReplyForm postId={post.id} isQuestion={isQuestion} />

      {replyRows.length > 0 && (
        <section aria-label="Replies" className="flex flex-col gap-2.5">
          <h2 className="px-1 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            {replyRows.length}{" "}
            {isQuestion
              ? replyRows.length === 1
                ? "answer"
                : "answers"
              : replyRows.length === 1
                ? "reply"
                : "replies"}
          </h2>
          {replyRows.map((reply) => (
            <div
              key={reply.id}
              className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="mb-1.5 flex items-center gap-2 text-sm">
                <Link href={`/u/${reply.username}`} className="shrink-0">
                  <Avatar username={reply.username} size="sm" />
                </Link>
                <Link
                  href={`/u/${reply.username}`}
                  className="truncate font-semibold hover:underline"
                >
                  @{reply.username}
                </Link>
                <time className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
                  {timeAgo(reply.createdAt)}
                </time>
              </div>
              <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">
                {reply.body}
              </p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
