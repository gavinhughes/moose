"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, signup, type FormState } from "@/lib/actions";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    isSignup ? signup : login,
    undefined,
  );

  const inputClass =
    "w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-[15px] outline-none transition-colors focus:border-sky-500 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-sky-400";

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="mb-6 text-center">
        <div className="text-5xl" aria-hidden>
          🫎
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">
          {isSignup ? "Join the herd" : "Welcome back"}
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {isSignup
            ? "Pick a name, pick a password, start posting."
            : "Log in to share what's on your mind."}
        </p>
      </div>

      <form action={formAction} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Username
          <input
            name="username"
            required
            defaultValue={state?.username}
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            {...(isSignup && {
              minLength: 3,
              maxLength: 20,
              pattern: "[a-zA-Z0-9_]+",
              title: "Letters, numbers, and underscores only",
            })}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Password
          <input
            name="password"
            type="password"
            required
            autoComplete={isSignup ? "new-password" : "current-password"}
            {...(isSignup && { minLength: 8 })}
            className={inputClass}
          />
        </label>

        {state?.error && (
          <p
            role="alert"
            className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
          >
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-1 min-h-12 cursor-pointer rounded-xl bg-zinc-900 text-[15px] font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          {pending ? "One sec…" : isSignup ? "Create account" : "Log in"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-zinc-500 dark:text-zinc-400">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-sky-600 hover:underline dark:text-sky-400">
              Log in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/signup" className="font-medium text-sky-600 hover:underline dark:text-sky-400">
              Join the herd
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
