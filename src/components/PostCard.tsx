import Link from "next/link";
import { timeAgo } from "@/lib/format";
import type { FeedPost } from "@/lib/queries";
import { Avatar } from "./Avatar";
import { LikeButton } from "./LikeButton";

export function PostCard({
  post,
  detail = false,
}: {
  post: FeedPost;
  detail?: boolean;
}) {
  const isQuestion = post.type === "question";
  const body = (
    <p
      className={`whitespace-pre-wrap break-words leading-relaxed ${
        detail ? "text-lg" : "text-[15px]"
      }`}
    >
      {post.body}
    </p>
  );

  return (
    <article
      className={`rounded-2xl border bg-white p-4 shadow-sm dark:bg-zinc-900 ${
        isQuestion
          ? "border-violet-200 dark:border-violet-500/25"
          : "border-zinc-200 dark:border-zinc-800"
      }`}
    >
      <div className="mb-2.5 flex items-center gap-2.5">
        <Link href={`/u/${post.username}`} className="shrink-0">
          <Avatar username={post.username} />
        </Link>
        <div className="min-w-0 flex-1 text-sm">
          <Link
            href={`/u/${post.username}`}
            className="block truncate font-semibold hover:underline"
          >
            @{post.username}
          </Link>
          <time className="text-xs text-zinc-500 dark:text-zinc-400">
            {timeAgo(post.createdAt)}
          </time>
        </div>
        {isQuestion && (
          <span className="shrink-0 rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
            Question
          </span>
        )}
      </div>

      {detail ? (
        body
      ) : (
        <Link href={`/post/${post.id}`} className="block">
          {body}
        </Link>
      )}

      <div className="mt-2 flex items-center gap-5">
        <LikeButton
          postId={post.id}
          liked={Boolean(post.likedByMe)}
          count={post.likeCount}
        />
        <Link
          href={`/post/${post.id}`}
          className="flex min-h-11 items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-sky-600 dark:text-zinc-400"
        >
          <svg
            viewBox="0 0 24 24"
            className="size-[18px] fill-none stroke-current"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          {post.replyCount > 0 ? (
            <span className="tabular-nums">{post.replyCount}</span>
          ) : (
            <span>{isQuestion ? "Answer" : "Reply"}</span>
          )}
        </Link>
      </div>
    </article>
  );
}
