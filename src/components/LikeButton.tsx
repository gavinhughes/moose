"use client";

import { useOptimistic, useTransition } from "react";
import { toggleLike } from "@/lib/actions";

export function LikeButton({
  postId,
  liked,
  count,
}: {
  postId: number;
  liked: boolean;
  count: number;
}) {
  const [, startTransition] = useTransition();
  const [opt, setOpt] = useOptimistic({ liked, count });

  return (
    <button
      aria-label={opt.liked ? "Unlike" : "Like"}
      aria-pressed={opt.liked}
      onClick={() =>
        startTransition(async () => {
          setOpt({
            liked: !opt.liked,
            count: opt.count + (opt.liked ? -1 : 1),
          });
          await toggleLike(postId);
        })
      }
      className={`group flex min-h-11 cursor-pointer items-center gap-1.5 text-sm transition-colors ${
        opt.liked
          ? "text-rose-500"
          : "text-zinc-500 hover:text-rose-500 dark:text-zinc-400"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className={`size-[18px] transition-transform group-active:scale-125 ${
          opt.liked ? "fill-rose-500 stroke-rose-500" : "fill-none stroke-current"
        }`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
      {opt.count > 0 && <span className="tabular-nums">{opt.count}</span>}
    </button>
  );
}
