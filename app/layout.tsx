import type { ReactNode } from "react";
import "./globals.css";
import { AuthButton } from "@/components/AuthButton";
import Link from "next/link";

export const metadata = {
  title: "AI Skill Map Generator",
  description: "AI がスキルを分析し、学習ロードマップを自動生成するツール"
};

const navLinks = [
  { href: "/", label: "ホーム", emoji: "🏠" },
  { href: "/dashboard", label: "ダッシュボード", emoji: "📊" },
  { href: "/about", label: "このアプリについて", emoji: "ℹ️" },
  { href: "/portfolio", label: "ポートフォリオ整理", emoji: "📁" },
  { href: "/legal", label: "利用について", emoji: "📜" }
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30 text-foreground antialiased">
        {/* Decorative background elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-200/30 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-indigo-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl" />
        </div>

        <div className="min-h-screen flex flex-col">
          <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-lg">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
              <Link href="/" className="flex items-center gap-2.5 min-w-0 group">
                <div className="relative h-8 w-8 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-emerald-400 shadow-lg shadow-sky-400/30 group-hover:shadow-xl group-hover:shadow-sky-400/40 transition-shadow">
                  <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h1 className="truncate text-base sm:text-lg font-bold tracking-tight text-slate-900">
                  AI Skill Map
                  <span className="hidden sm:inline text-slate-600 font-medium"> Generator</span>
                </h1>
              </Link>
              <div className="flex items-center gap-3">
                <nav className="hidden md:flex gap-1 text-sm">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <AuthButton />
              </div>
            </div>
            
            {/* Mobile navigation */}
            <div className="md:hidden border-t border-slate-100 bg-white/90">
              <nav className="max-w-5xl mx-auto px-3 py-2 flex gap-1.5 overflow-x-auto">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="whitespace-nowrap flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 text-[11px] text-slate-700 font-medium transition-colors"
                  >
                    <span>{link.emoji}</span>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>

          <main className="flex-1">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10">
              <div className="relative rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur shadow-xl shadow-slate-200/50 overflow-hidden">
                {/* Card header decoration */}
                <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-sky-50/50 to-transparent" />
                
                <div className="relative p-5 sm:p-6 md:p-8">{children}</div>
              </div>
            </div>
          </main>

          <footer className="border-t border-slate-200/80 bg-white/50 backdrop-blur-sm">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-lg bg-gradient-to-tr from-sky-500 via-indigo-500 to-emerald-400" />
                  <span className="text-sm font-medium text-slate-700">
                    AI Skill Map Generator
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  © {new Date().getFullYear()} All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
