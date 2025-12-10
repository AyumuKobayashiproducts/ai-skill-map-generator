"use client";

import Link from "next/link";
import clsx from "clsx";

interface AppLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  href?: string;
  className?: string;
}

export function AppLogo({
  size = "md",
  showText = true,
  href = "/",
  className,
}: AppLogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-lg",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base sm:text-lg",
    lg: "text-xl sm:text-2xl",
  };

  const logoIcon = (
    <div
      className={clsx(
        "relative rounded-2xl bg-gradient-to-br from-sky-400 via-indigo-500 to-emerald-400 shadow-lg shadow-sky-400/30 flex items-center justify-center font-bold text-white transition-all duration-300 group-hover:shadow-xl group-hover:shadow-sky-400/40 group-hover:scale-105",
        sizeClasses[size]
      )}
    >
      {/* Inner glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="relative font-black tracking-tight drop-shadow-sm">SM</span>
    </div>
  );

  const content = (
    <>
      {logoIcon}
      {showText && (
        <div className="min-w-0">
          <h1
            className={clsx(
              "truncate font-bold tracking-tight text-slate-900",
              textSizeClasses[size]
            )}
          >
            AI Skill Map
            <span className="hidden sm:inline text-slate-600 font-medium">
              {" "}
              Generator
            </span>
          </h1>
        </div>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={clsx(
          "flex items-center gap-2.5 min-w-0 group",
          className
        )}
        aria-label="AI Skill Map Generator トップページへ"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={clsx("flex items-center gap-2.5 min-w-0 group", className)}>
      {content}
    </div>
  );
}

// ロゴアイコンのみを表示するコンポーネント（中央配置用など）
export function AppLogoIcon({
  size = "lg",
  className,
}: {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-10 w-10 text-sm rounded-xl",
    md: "h-14 w-14 text-lg rounded-2xl",
    lg: "h-20 w-20 text-2xl rounded-2xl",
    xl: "h-24 w-24 text-3xl rounded-3xl",
  };

  return (
    <div
      className={clsx(
        "relative bg-gradient-to-br from-sky-400 via-indigo-500 to-emerald-400 shadow-xl shadow-indigo-400/40 flex items-center justify-center font-bold text-white",
        sizeClasses[size],
        className
      )}
    >
      {/* Shine effect */}
      <div className="absolute inset-0 rounded-inherit bg-gradient-to-br from-white/30 via-transparent to-transparent" />
      <span className="relative font-black tracking-tight drop-shadow-md">SM</span>
    </div>
  );
}






