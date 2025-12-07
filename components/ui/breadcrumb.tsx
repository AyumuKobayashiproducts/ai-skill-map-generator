import Link from "next/link";
import type { Route } from "next";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: Route | string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * パンくずリストコンポーネント
 * ナビゲーションの階層構造を表示
 * 
 * @example
 * <Breadcrumb
 *   items={[
 *     { label: "ホーム", href: "/" },
 *     { label: "ダッシュボード", href: "/dashboard" },
 *     { label: "結果" }
 *   ]}
 * />
 */
export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const t = useTranslations("ui.breadcrumb");

  if (items.length === 0) return null;

  return (
    <nav
      aria-label={t("ariaLabel")}
      className={cn("flex items-center text-sm", className)}
    >
      <ol className="flex items-center gap-1 flex-wrap" role="list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-1">
              {index > 0 && (
                <svg
                  className="w-4 h-4 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href as Route}
                  className="text-slate-500 hover:text-slate-900 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 rounded"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    "text-slate-900 font-medium",
                    isLast && "aria-current"
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

