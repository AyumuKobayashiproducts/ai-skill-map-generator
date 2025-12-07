"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import clsx from "clsx";
import type { Locale } from "@/src/i18n/config";
import { locales } from "@/src/i18n/config";

const orderedLocales: Locale[] = ["ja", "en"];

export function LanguageSwitcher() {
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

  return (
    <div className="inline-flex items-center rounded-full border border-slate-200 bg-white text-[11px] text-slate-600 shadow-sm">
      {orderedLocales.map((locale) => (
        <Link
          key={locale}
          href={createHref(locale)}
          className={clsx(
            "px-2 py-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-1",
            locale === currentLocale
              ? "bg-slate-900 text-white"
              : "hover:bg-slate-100"
          )}
          aria-label={locale === "ja" ? "日本語表示に切り替え" : "Switch to English"}
        >
          {locale === "ja" ? "JP" : "EN"}
        </Link>
      ))}
    </div>
  );
}


