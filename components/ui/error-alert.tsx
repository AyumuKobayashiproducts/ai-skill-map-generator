import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ErrorAlertProps extends HTMLAttributes<HTMLDivElement> {
  message: string;
}

// 共通のエラー表示コンポーネント
export function ErrorAlert({ message, className, ...props }: ErrorAlertProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700",
        className
      )}
      role="alert"
      aria-live="polite"
      {...props}
    >
      <span className="mt-[1px] text-[10px] font-semibold">!</span>
      <p className="flex-1 whitespace-pre-wrap">{message}</p>
    </div>
  );
}


