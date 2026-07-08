import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "A No Knee Moose",
  description:
    "Fling your random thoughts and questions at the world, and see what comes back.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="mx-auto w-full max-w-xl flex-1 px-4 py-5">
          {children}
        </main>
        <footer className="pb-6 pt-2 text-center text-xs text-zinc-400 dark:text-zinc-600">
          A No Knee Moose — say it out loud 🫎
        </footer>
      </body>
    </html>
  );
}
