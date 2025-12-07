"use client";

import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ErrorAlertProps extends HTMLAttributes<HTMLDivElement> {
  message: string;
  variant?: "error" | "warning" | "info";
}

const variants = {
  error: {
    container: "border-red-200 bg-gradient-to-r from-red-50 to-rose-50",
    icon: "bg-red-100 text-red-600",
    text: "text-red-700",
    emoji: "⚠️"
  },
  warning: {
    container: "border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50",
    icon: "bg-amber-100 text-amber-600",
    text: "text-amber-700",
    emoji: "💡"
  },
  info: {
    container: "border-sky-200 bg-gradient-to-r from-sky-50 to-blue-50",
    icon: "bg-sky-100 text-sky-600",
    text: "text-sky-700",
    emoji: "ℹ️"
  }
};

export function ErrorAlert({ 
  message, 
  variant = "error", 
  className, 
  ...props 
}: ErrorAlertProps) {
  if (!message) return null;

  const styles = variants[variant];

  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-2xl border-2 p-5 shadow-lg animate-fade-in-up",
        styles.container,
        className
      )}
      role="alert"
      aria-live="polite"
      {...props}
    >
      <div className={cn(
        "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm",
        styles.icon
      )}>
        {styles.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("text-base font-bold mb-1", styles.text)}>
          {variant === "error" && "エラーが発生しました"}
          {variant === "warning" && "ご注意ください"}
          {variant === "info" && "お知らせ"}
        </p>
        <p className={cn("text-sm leading-relaxed", styles.text, "opacity-90")}>
          {message}
        </p>
        {variant === "error" && (
          <div className="mt-3 pt-3 border-t border-current/10">
            <p className="text-xs opacity-75">
              💡 問題が解決しない場合は、以下をお試しください：
            </p>
            <ul className="mt-1 text-xs opacity-75 space-y-0.5 list-disc list-inside">
              <li>ページを再読み込みする</li>
              <li>しばらく時間をおいてから再度お試しください</li>
              <li>問題が続く場合は、GitHubのIssuesでご報告ください</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// シンプルなインラインエラー用
export function InlineError({ message }: { message: string }) {
  if (!message) return null;
  
  return (
    <p className="flex items-center gap-1.5 text-xs text-red-600 animate-fade-in">
      <span>⚠️</span>
      {message}
    </p>
  );
}
