const COLORS = [
  "bg-rose-500",
  "bg-orange-500",
  "bg-amber-600",
  "bg-emerald-600",
  "bg-teal-600",
  "bg-sky-600",
  "bg-violet-600",
  "bg-pink-600",
];

export function Avatar({
  username,
  size = "md",
}: {
  username: string;
  size?: "sm" | "md" | "lg";
}) {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = (hash * 31 + username.charCodeAt(i)) % COLORS.length;
  }
  const sizes = {
    sm: "size-6 text-xs",
    md: "size-9 text-sm",
    lg: "size-14 text-xl",
  };
  return (
    <span
      aria-hidden
      className={`${sizes[size]} ${COLORS[hash]} inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold text-white`}
    >
      {username[0].toUpperCase()}
    </span>
  );
}
