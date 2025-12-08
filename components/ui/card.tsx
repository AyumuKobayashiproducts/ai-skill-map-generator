"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/* ============================================
   Card Component System (Stripe/Vercel style)
   ============================================ */

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, hover = false, padding = "md", ...props }, ref) => {
    const paddingStyles = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "bg-white rounded-xl border border-gray-200",
          "shadow-sm",
          hover && "transition-all duration-200 hover:shadow-md hover:border-gray-300 hover:-translate-y-0.5",
          paddingStyles[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

/* ============================================
   Card Header
   ============================================ */
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("px-6 py-4 border-b border-gray-100", className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = "CardHeader";

/* ============================================
   Card Title
   ============================================ */
interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, className, as: Component = "h3", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn("text-base font-semibold text-gray-900", className)}
      {...props}
    >
      {children}
    </Component>
  )
);

CardTitle.displayName = "CardTitle";

/* ============================================
   Card Description
   ============================================ */
interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ children, className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-gray-500 mt-1", className)}
      {...props}
    >
      {children}
    </p>
  )
);

CardDescription.displayName = "CardDescription";

/* ============================================
   Card Content
   ============================================ */
interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6", className)} {...props}>
      {children}
    </div>
  )
);

CardContent.displayName = "CardContent";

/* ============================================
   Card Footer
   ============================================ */
interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = "CardFooter";

/* ============================================
   Stat Card (Dashboard style)
   ============================================ */
interface StatCardProps {
  label: string;
  value: string | number;
  change?: {
    value: string;
    positive?: boolean;
  };
  icon?: ReactNode;
  className?: string;
}

export function StatCard({ label, value, change, icon, className }: StatCardProps) {
  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-2xl font-semibold text-gray-900 tabular-nums">
            {value}
          </p>
          {change && (
            <p
              className={cn(
                "text-sm font-medium",
                change.positive ? "text-success-600" : "text-error-600"
              )}
            >
              {change.positive ? "↑" : "↓"} {change.value}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
