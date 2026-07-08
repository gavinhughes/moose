import Link from "next/link";
import type { PostType } from "@/db/schema";

const CHIPS: { label: string; value?: PostType }[] = [
  { label: "All" },
  { label: "Thoughts", value: "thought" },
  { label: "Questions", value: "question" },
];

export function FilterChips({ active }: { active?: PostType }) {
  return (
    <nav className="flex gap-1.5" aria-label="Filter posts">
      {CHIPS.map(({ label, value }) => {
        const isActive = active === value;
        return (
          <Link
            key={label}
            href={value ? `/?filter=${value}` : "/"}
            scroll={false}
            aria-current={isActive ? "page" : undefined}
            className={`flex min-h-11 items-center rounded-full px-4 text-sm font-medium transition-colors ${
              isActive
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
