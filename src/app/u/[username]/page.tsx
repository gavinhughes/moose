import { notFound, redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { Avatar } from "@/components/Avatar";
import { PostCard } from "@/components/PostCard";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { fetchPosts } from "@/lib/queries";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const [profile] = await db
    .select({
      id: users.id,
      username: users.username,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.username, username));
  if (!profile) notFound();

  const userPosts = await fetchPosts({
    currentUserId: user.id,
    username: profile.username,
    limit: 200,
  });

  const isMe = user.id === profile.id;

  return (
    <div className="flex flex-col gap-4">
      <section className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <Avatar username={profile.username} size="lg" />
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold tracking-tight">
            @{profile.username}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Joined{" "}
            {profile.createdAt.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}{" "}
            · {userPosts.length} {userPosts.length === 1 ? "post" : "posts"}
          </p>
        </div>
      </section>

      {userPosts.length === 0 ? (
        <p className="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {isMe
            ? "You haven't posted anything yet. Go on, say something."
            : `@${profile.username} hasn't posted anything yet.`}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {userPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
