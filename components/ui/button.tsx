"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/* ============================================
   Button Component (Vercel/Linear style)
   ============================================ */

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      "inline-flex items-center justify-center gap-2",
      "font-medium text-sm",
      "rounded-lg",
      "transition-all duration-150 ease-out",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
      "active:scale-[0.98]"
    );

    const variants: Record<string, string> = {
      primary: cn(
        "bg-gray-900 text-white",
        "hover:bg-gray-800",
        "active:bg-gray-950",
        "shadow-sm hover:shadow-md"
      ),
      secondary: cn(
        "bg-white text-gray-700",
        "border border-gray-200",
        "hover:bg-gray-50 hover:border-gray-300",
        "active:bg-gray-100"
      ),
      ghost: cn(
        "bg-transparent text-gray-600",
        "hover:bg-gray-100 hover:text-gray-900"
      ),
      danger: cn(
        "bg-error-500 text-white",
        "hover:bg-error-600",
        "active:bg-error-600"
      ),
      outline: cn(
        "bg-transparent text-gray-700",
        "border border-gray-200",
        "hover:bg-gray-50 hover:border-gray-300",
        "active:bg-gray-100"
      ),
    };

    const sizes: Record<string, string> = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Spinner className="w-4 h-4" />
            <span>{children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

/* ============================================
   Spinner Component
   ============================================ */
interface SpinnerProps {
  className?: string;
}

export function Spinner({ className }: SpinnerProps) {
  return (
    <svg
      className={cn("animate-spin", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
