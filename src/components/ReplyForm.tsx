"use client";

import { useActionState, useState } from "react";
import { createReply, type FormState } from "@/lib/actions";

const MAX = 500;

export function ReplyForm({
  postId,
  isQuestion,
}: {
  postId: number;
  isQuestion: boolean;
}) {
  const action = createReply.bind(null, postId);
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    undefined,
  );
  const [body, setBody] = useState("");
  const [handledSuccess, setHandledSuccess] = useState<number>();

  // Clear the textarea after a successful reply (render-phase state adjustment).
  if (state?.success && state.success !== handledSuccess) {
    setHandledSuccess(state.success);
    setBody("");
  }

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <textarea
        name="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={MAX}
        rows={2}
        required
        placeholder={isQuestion ? "Know the answer? Share it…" : "Say something back…"}
        className="w-full resize-none bg-transparent text-[15px] leading-relaxed outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
      />
      {state?.error && (
        <p className="mb-2 text-sm text-rose-600 dark:text-rose-400">
          {state.error}
        </p>
      )}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending || body.trim().length === 0}
          className="min-h-11 cursor-pointer rounded-full bg-sky-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-sky-500 disabled:cursor-default disabled:opacity-40"
        >
          {pending ? "Posting…" : isQuestion ? "Answer" : "Reply"}
        </button>
      </div>
    </form>
  );
}
