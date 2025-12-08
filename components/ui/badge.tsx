"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ============================================
   Badge Component (Linear/Vercel style)
   ============================================ */

type BadgeVariant = "default" | "blue" | "green" | "yellow" | "red" | "purple";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  icon?: ReactNode;
}

export function Badge({
  children,
  className,
  variant = "default",
  size = "md",
  dot = false,
  icon,
  ...props
}: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    default: "bg-gray-100 text-gray-700",
    blue: "bg-blue-50 text-blue-700",
    green: "bg-success-50 text-success-600",
    yellow: "bg-warning-50 text-warning-600",
    red: "bg-error-50 text-error-600",
    purple: "bg-purple-50 text-purple-700",
  };

  const dotColors: Record<BadgeVariant, string> = {
    default: "bg-gray-500",
    blue: "bg-blue-500",
    green: "bg-success-500",
    yellow: "bg-warning-500",
    red: "bg-error-500",
    purple: "bg-purple-500",
  };

  const sizes: Record<BadgeSize, string> = {
    sm: "px-1.5 py-0.5 text-2xs",
    md: "px-2 py-0.5 text-xs",
    lg: "px-2.5 py-1 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-full",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full", dotColors[variant])}
          aria-hidden="true"
        />
      )}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

/* ============================================
   Status Badge (specific use case)
   ============================================ */

type StatusType = "active" | "inactive" | "pending" | "error" | "success";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config: Record<StatusType, { variant: BadgeVariant; defaultLabel: string }> = {
    active: { variant: "green", defaultLabel: "Active" },
    inactive: { variant: "default", defaultLabel: "Inactive" },
    pending: { variant: "yellow", defaultLabel: "Pending" },
    error: { variant: "red", defaultLabel: "Error" },
    success: { variant: "green", defaultLabel: "Success" },
  };

  const { variant, defaultLabel } = config[status];

  return (
    <Badge variant={variant} dot className={className}>
      {label || defaultLabel}
    </Badge>
  );
}

/* ============================================
   Level Badge (skill level indicator)
   ============================================ */

type LevelType = "high" | "medium" | "low";

interface LevelBadgeProps {
  level: LevelType;
  className?: string;
}

export function LevelBadge({ level, className }: LevelBadgeProps) {
  const config: Record<LevelType, { variant: BadgeVariant; label: string }> = {
    high: { variant: "green", label: "High" },
    medium: { variant: "yellow", label: "Medium" },
    low: { variant: "red", label: "Low" },
  };

  const { variant, label } = config[level];

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}

