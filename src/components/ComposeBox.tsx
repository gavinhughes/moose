"use client";

import { useActionState, useState } from "react";
import { createPost, type FormState } from "@/lib/actions";

const MAX = 500;

export function ComposeBox() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    createPost,
    undefined,
  );
  const [type, setType] = useState<"thought" | "question">("thought");
  const [body, setBody] = useState("");
  const [handledSuccess, setHandledSuccess] = useState<number>();

  // Clear the textarea after a successful post (render-phase state adjustment).
  if (state?.success && state.success !== handledSuccess) {
    setHandledSuccess(state.success);
    setBody("");
  }

  const isQuestion = type === "question";

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="mb-3 flex gap-1.5" role="radiogroup" aria-label="Post type">
        {(
          [
            ["thought", "💭 Thought"],
            ["question", "❓ Question"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={type === value}
            onClick={() => setType(value)}
            className={`min-h-11 cursor-pointer rounded-full px-4 text-sm font-medium transition-colors ${
              type === value
                ? value === "question"
                  ? "bg-violet-600 text-white"
                  : "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <input type="hidden" name="type" value={type} />
      <textarea
        name="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={MAX}
        rows={3}
        required
        placeholder={
          isQuestion
            ? "Ask the world anything…"
            : "What's rattling around your head?"
        }
        className="w-full resize-none bg-transparent text-[15px] leading-relaxed outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
      />
      {state?.error && (
        <p className="mb-2 text-sm text-rose-600 dark:text-rose-400">
          {state.error}
        </p>
      )}
      <div className="flex items-center justify-between">
        <span
          className={`text-xs tabular-nums ${
            body.length >= MAX
              ? "font-semibold text-rose-500"
              : "text-zinc-400 dark:text-zinc-500"
          }`}
        >
          {body.length}/{MAX}
        </span>
        <button
          type="submit"
          disabled={pending || body.trim().length === 0}
          className={`min-h-11 cursor-pointer rounded-full px-5 text-sm font-semibold text-white transition-colors disabled:cursor-default disabled:opacity-40 ${
            isQuestion
              ? "bg-violet-600 hover:bg-violet-500"
              : "bg-sky-600 hover:bg-sky-500"
          }`}
        >
          {pending ? "Posting…" : isQuestion ? "Ask away" : "Share it"}
        </button>
      </div>
    </form>
  );
}
