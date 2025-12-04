"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export function Button({
  children,
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  const base =
    "group inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]";

  const variants: Record<string, string> = {
    default:
      "relative bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-400 text-white font-semibold shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/30 hover:-translate-y-0.5 before:absolute before:inset-0 before:rounded-lg before:bg-white/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity overflow-hidden",
    outline:
      "border-2 border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50/50 hover:text-sky-700 shadow-sm",
    ghost: 
      "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  };

  const sizes: Record<string, string> = {
    default: "h-10 px-5",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-8 text-base"
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </button>
  );
}
