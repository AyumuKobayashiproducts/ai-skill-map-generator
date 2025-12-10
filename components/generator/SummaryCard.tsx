"use client";

import { TrendingUp, AlertTriangle, Target, LucideIcon } from "lucide-react";
import { SummaryItem } from "@/types/skillGenerator";

interface SummaryCardProps {
  type: "strengths" | "weaknesses" | "nextFocus";
  items: SummaryItem[];
}

const CONFIG: Record<
  SummaryCardProps["type"],
  {
    title: string;
    icon: LucideIcon;
    className: string;
  }
> = {
  strengths: {
    title: "Strengths",
    icon: TrendingUp,
    className: "summary-card-strength",
  },
  weaknesses: {
    title: "Areas to Improve",
    icon: AlertTriangle,
    className: "summary-card-weakness",
  },
  nextFocus: {
    title: "Next Focus",
    icon: Target,
    className: "summary-card-focus",
  },
};

export function SummaryCard({ type, items }: SummaryCardProps) {
  const { title, icon: Icon, className } = CONFIG[type];

  return (
    <div className={`summary-card ${className} animate-fade-in-up`}>
      <div className="summary-card-icon">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
        {title}
      </h3>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex gap-3">
            <span className="text-[var(--text-muted)] shrink-0">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {item.title}
              </p>
              <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                {item.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

