"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import clsx from "clsx";
import type { Locale } from "@/src/i18n/config";
import { locales } from "@/src/i18n/config";

const orderedLocales: Locale[] = ["ja", "en"];

interface LanguageSwitcherProps {
  /** コンパクト表示（現在の言語のみ表示、クリックで切り替え） */
  compact?: boolean;
  className?: string;
}

export function LanguageSwitcher({ compact = false, className }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!pathname) return null;

  const segments = pathname.split("/");
  const firstSegment = segments[1] ?? "";
  const currentLocale = (locales as readonly string[]).includes(firstSegment)
    ? (firstSegment as Locale)
    : ("ja" as Locale);

  const createHref = (targetLocale: Locale) => {
    const allLocales = locales as readonly string[];
    const isLocalized = allLocales.includes(firstSegment);

    let basePath: string;
    if (isLocalized) {
      // /ja/foo/bar -> /en/foo/bar
      const rest = segments.slice(2).join("/");
      basePath = rest ? `/${targetLocale}/${rest}` : `/${targetLocale}`;
    } else {
      // /auth/login -> /en/auth/login, / -> /en
      if (pathname === "/") {
        basePath = `/${targetLocale}`;
      } else {
        basePath = `/${targetLocale}${pathname}`;
      }
    }

    const qs = searchParams?.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  // コンパクトモード: 現在の言語以外の言語ボタンを1つだけ表示
  if (compact) {
    const targetLocale = currentLocale === "ja" ? "en" : "ja";
    return (
      <Link
        href={createHref(targetLocale)}
        className={clsx(
          "inline-flex items-center justify-center h-9 px-3.5 rounded-full",
          "border border-slate-200 bg-white/90 backdrop-blur-sm",
          "text-xs font-semibold text-slate-600",
          "shadow-sm hover:shadow hover:bg-white hover:border-slate-300",
          "transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2",
          className
        )}
        aria-label={targetLocale === "ja" ? "日本語表示に切り替え" : "Switch to English"}
      >
        {targetLocale === "ja" ? "JP" : "EN"}
      </Link>
    );
  }

  // 通常モード: JP / EN の切り替えトグル
  return (
    <div
      className={clsx(
        "inline-flex items-center rounded-full border border-slate-200 bg-white/90 backdrop-blur-sm text-xs font-medium text-slate-600 shadow-sm overflow-hidden",
        className
      )}
    >
      {orderedLocales.map((locale) => (
        <Link
          key={locale}
          href={createHref(locale)}
          className={clsx(
            "px-3 py-1.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-inset",
            locale === currentLocale
              ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold shadow-inner"
              : "hover:bg-slate-100 text-slate-500 hover:text-slate-700"
          )}
          aria-label={locale === "ja" ? "日本語表示に切り替え" : "Switch to English"}
          aria-current={locale === currentLocale ? "true" : undefined}
        >
          {locale === "ja" ? "JP" : "EN"}
        </Link>
      ))}
    </div>
  );
}


