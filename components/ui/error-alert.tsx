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
        "flex items-start gap-3 rounded-xl border p-4 animate-fade-in-up",
        styles.container,
        className
      )}
      role="alert"
      aria-live="polite"
      {...props}
    >
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm",
        styles.icon
      )}>
        {styles.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium", styles.text)}>
          {variant === "error" && "エラーが発生しました"}
          {variant === "warning" && "注意"}
          {variant === "info" && "お知らせ"}
        </p>
        <p className={cn("mt-1 text-xs leading-relaxed", styles.text, "opacity-90")}>
          {message}
        </p>
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
