import Link from "next/link";
import { redirect } from "next/navigation";
import { ComposeBox } from "@/components/ComposeBox";
import { FilterChips } from "@/components/FilterChips";
import { PostCard } from "@/components/PostCard";
import type { PostType } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { fetchPosts } from "@/lib/queries";

const PAGE_SIZE = 30;

const EMPTY_MESSAGES: Record<string, string> = {
  all: "Nothing here yet. Be the first to say something into the void.",
  thought: "No thoughts yet — surely someone is thinking something.",
  question: "No questions yet. Ask one!",
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; count?: string }>;
}) {
  const { filter: rawFilter, count: rawCount } = await searchParams;
  const filter: PostType | undefined =
    rawFilter === "thought" || rawFilter === "question" ? rawFilter : undefined;
  const count = Math.min(
    Math.max(Number(rawCount) || PAGE_SIZE, PAGE_SIZE),
    3000,
  );

  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const rows = await fetchPosts({
    currentUserId: user.id,
    filter,
    limit: count + 1,
  });
  const hasMore = rows.length > count;
  const shown = hasMore ? rows.slice(0, count) : rows;

  const moreParams = new URLSearchParams();
  if (filter) moreParams.set("filter", filter);
  moreParams.set("count", String(count + PAGE_SIZE));

  return (
    <div className="flex flex-col gap-4">
      <ComposeBox />

      <FilterChips active={filter} />

      {shown.length === 0 ? (
        <p className="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {EMPTY_MESSAGES[filter ?? "all"]}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {shown.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {hasMore && (
        <Link
          href={`/?${moreParams}`}
          scroll={false}
          className="mx-auto rounded-full bg-zinc-100 px-6 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
        >
          Load more
        </Link>
      )}
    </div>
  );
}
