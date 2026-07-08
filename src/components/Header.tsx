import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { logout } from "@/lib/actions";

export async function Header() {
  const user = await getCurrentUser();
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-[var(--background)]/85 backdrop-blur dark:border-zinc-800">
      <div className="mx-auto flex h-14 max-w-xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-[15px] font-bold tracking-tight"
        >
          <span className="text-2xl" aria-hidden>
            🫎
          </span>
          <span>A No Knee Moose</span>
        </Link>
        {user ? (
          <nav className="flex items-center gap-3 text-sm">
            <Link
              href={`/u/${user.username}`}
              className="max-w-32 truncate font-medium hover:underline"
            >
              @{user.username}
            </Link>
            <form action={logout}>
              <button className="min-h-11 cursor-pointer text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                Log out
              </button>
            </form>
          </nav>
        ) : (
          <nav className="flex items-center gap-1.5 text-sm">
            <Link
              href="/login"
              className="rounded-full px-3.5 py-2 font-medium hover:bg-zinc-200/60 dark:hover:bg-zinc-800"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-zinc-900 px-3.5 py-2 font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              Join
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
