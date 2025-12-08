"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/* ============================================
   Navigation Labels (i18n-safe)
   ============================================ */
const labels = {
  ja: {
    home: "ホーム",
    dashboard: "ダッシュボード",
    about: "このアプリについて",
    portfolio: "ポートフォリオ",
    legal: "利用について"
  },
  en: {
    home: "Home",
    dashboard: "Dashboard",
    about: "About",
    portfolio: "Portfolio",
    legal: "Terms"
  }
} as const;

const navItems = [
  { path: "", key: "home" },
  { path: "/dashboard", key: "dashboard" },
  { path: "/about", key: "about" },
  { path: "/portfolio", key: "portfolio" },
  { path: "/legal", key: "legal" }
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

  // 現在のページを判定
  const currentPath = segments.slice(2).join("/");

  if (variant === "desktop") {
    return (
      <>
        {navItems.map((item) => {
          const href = item.path ? `${basePath}${item.path}` : basePath;
          const label = t[item.key as keyof typeof t];
          const isActive = item.path === "" 
            ? currentPath === "" 
            : currentPath.startsWith(item.path.slice(1));

          return (
            <Link
              key={item.key}
              href={href}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                isActive
                  ? "text-gray-900 bg-gray-100"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              {label}
            </Link>
          );
        })}
      </>
    );
  }

  // Mobile variant
  return (
    <>
      {navItems.map((item) => {
        const href = item.path ? `${basePath}${item.path}` : basePath;
        const label = t[item.key as keyof typeof t];
        const isActive = item.path === "" 
          ? currentPath === "" 
          : currentPath.startsWith(item.path.slice(1));

        return (
          <Link
            key={item.key}
            href={href}
            className={cn(
              "whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              isActive
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
            )}
          >
            {label}
          </Link>
        );
      })}
    </>
  );
}
