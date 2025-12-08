"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// ルートレイアウト（NextIntlClientProvider の外）でも使われるため、
// useTranslations を使わず locale に基づいた固定テキストを使用する
const labels = {
  ja: {
    home: "ホーム",
    dashboard: "ダッシュボード",
    about: "このアプリについて",
    portfolio: "ポートフォリオ整理",
    legal: "利用について"
  },
  en: {
    home: "Home",
    dashboard: "Dashboard",
    about: "About",
    portfolio: "Portfolio",
    legal: "Usage & terms"
  }
} as const;

const navItems = [
  { path: "", key: "home", emoji: "🏠" },
  { path: "/dashboard", key: "dashboard", emoji: "📊" },
  { path: "/about", key: "about", emoji: "ℹ️" },
  { path: "/portfolio", key: "portfolio", emoji: "📁" },
  { path: "/legal", key: "legal", emoji: "📜" }
] as const;

interface NavLinksProps {
  variant: "desktop" | "mobile";
}

export function NavLinks({ variant }: NavLinksProps) {
  const pathname = usePathname();

  // 現在のロケールを判定
  const segments = (pathname ?? "").split("/");
  const firstSegment = segments[1] ?? "";
  const locale: "ja" | "en" = firstSegment === "en" ? "en" : "ja";
  const t = labels[locale];
  const basePath = `/${locale}`;

  if (variant === "desktop") {
    return (
      <>
        {navItems.map((item) => {
          const href = item.path ? `${basePath}${item.path}` : basePath;
          const label = t[item.key as keyof typeof t];
          return (
            <Link
              key={item.key}
              href={href}
              className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
            >
              {label}
            </Link>
          );
        })}
      </>
    );
  }

  // mobile variant
  return (
    <>
      {navItems.map((item) => {
        const href = item.path ? `${basePath}${item.path}` : basePath;
        const label = t[item.key as keyof typeof t];
        return (
          <Link
            key={item.key}
            href={href}
            className="whitespace-nowrap flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 text-[11px] text-slate-700 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <span aria-hidden="true">{item.emoji}</span>
            {label}
          </Link>
        );
      })}
    </>
  );
}

