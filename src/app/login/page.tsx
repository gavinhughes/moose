import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Log in — A No Knee Moose" };

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/");
  return (
    <div className="py-10">
      <AuthForm mode="login" />
    </div>
  );
}
