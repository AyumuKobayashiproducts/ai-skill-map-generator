"use client";

import { memo, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from "chart.js";
import type { SkillCategories, SkillCategoryKey } from "@/types/skill";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface SkillChartProps {
  categories: SkillCategories;
}

const SKILL_KEYS: SkillCategoryKey[] = ["frontend", "backend", "infra", "ai", "tools"];

const LABEL_MAP: Record<SkillCategoryKey, { label: string; emoji: string }> = {
  frontend: { label: "Frontend", emoji: "🎨" },
  backend: { label: "Backend", emoji: "⚔️" },
  infra: { label: "Infra", emoji: "🛡️" },
  ai: { label: "AI", emoji: "🧪" },
  tools: { label: "Tools", emoji: "🔧" }
};

// チャートオプションのベース設定（文言以外）
const BASE_CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: true,
  animation: {
    duration: 1500,
    easing: "easeOutQuart" as const
  },
  scales: {
    r: {
      suggestedMin: 0,
      suggestedMax: 5,
      ticks: {
        stepSize: 1,
        color: "#94a3b8",
        backdropColor: "transparent",
        font: {
          size: 10
        }
      },
      grid: {
        color: "rgba(148, 163, 184, 0.2)",
        circular: true
      },
      angleLines: {
        color: "rgba(148, 163, 184, 0.3)"
      },
      pointLabels: {
        color: "#475569",
        font: {
          size: 12,
          weight: 500 as const
        },
        padding: 12
      }
    }
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: "rgba(15, 23, 42, 0.9)",
      titleColor: "#f8fafc",
      bodyColor: "#e2e8f0",
      borderColor: "rgba(99, 102, 241, 0.3)",
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
      displayColors: false,
      callbacks: {
        title: (items: Array<{ label?: string }>) => {
          const label = items[0]?.label ?? "";
          return label.replace(/^[^\s]+\s/, ""); // Remove emoji
        }
        // label はコンポーネント内でローカライズしたものを上書き
      }
    }
  },
  elements: {
    line: {
      tension: 0.1
    }
  }
} as const;

function SkillChartComponent({ categories }: SkillChartProps) {
  const t = useTranslations("skillChart");
  const labels = useMemo(
    () => SKILL_KEYS.map((k) => `${LABEL_MAP[k].emoji} ${LABEL_MAP[k].label}`),
    []
  );

  const dataValues = useMemo(
    () => SKILL_KEYS.map((k) => categories[k] ?? 0),
    [categories]
  );

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: t("datasetLabel"),
          data: dataValues,
          backgroundColor: (context: { chart: { ctx: CanvasRenderingContext2D; chartArea: { left: number; top: number; width: number; height: number } | null } }) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) {
              return "rgba(59, 130, 246, 0.15)";
            }
            const gradient = ctx.createRadialGradient(
              chartArea.left + chartArea.width / 2,
              chartArea.top + chartArea.height / 2,
              0,
              chartArea.left + chartArea.width / 2,
              chartArea.top + chartArea.height / 2,
              chartArea.width / 2
            );
            gradient.addColorStop(0, "rgba(59, 130, 246, 0.3)");
            gradient.addColorStop(0.5, "rgba(99, 102, 241, 0.2)");
            gradient.addColorStop(1, "rgba(16, 185, 129, 0.15)");
            return gradient;
          },
          borderColor: (context: { chart: { ctx: CanvasRenderingContext2D; chartArea: { left: number; top: number; right: number; bottom: number } | null } }) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) {
              return "rgba(59, 130, 246, 1)";
            }
            const gradient = ctx.createLinearGradient(
              chartArea.left,
              chartArea.top,
              chartArea.right,
              chartArea.bottom
            );
            gradient.addColorStop(0, "#38bdf8");
            gradient.addColorStop(0.5, "#6366f1");
            gradient.addColorStop(1, "#10b981");
            return gradient;
          },
          borderWidth: 3,
          pointBackgroundColor: "#ffffff",
          pointBorderColor: "#6366f1",
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: "#6366f1",
          pointHoverBorderColor: "#ffffff",
          pointHoverBorderWidth: 2
        }
      ]
    }),
    [labels, dataValues, t]
  );

  const legendItems = useMemo(
    () =>
      SKILL_KEYS.map((k) => ({
        key: k,
        emoji: LABEL_MAP[k].emoji,
        label: LABEL_MAP[k].label,
        value: categories[k] ?? 0
      })),
    [categories]
  );

  return (
    <div
      className="relative w-full max-w-sm md:max-w-md mx-auto p-4"
      role="img"
      aria-label={t("ariaChart")}
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-sky-50/50 via-transparent to-indigo-50/50 rounded-2xl"
        aria-hidden="true"
      />
      <div className="relative">
        <Radar
          data={data}
          options={{
            ...BASE_CHART_OPTIONS,
            plugins: {
              ...BASE_CHART_OPTIONS.plugins,
              tooltip: {
                ...BASE_CHART_OPTIONS.plugins.tooltip,
                callbacks: {
                  ...BASE_CHART_OPTIONS.plugins.tooltip.callbacks,
                  label: (item: { raw: unknown }) =>
                    t("tooltipLabel", { value: String(item.raw ?? "") })
                }
              }
            }
          }}
        />
      </div>

      {/* Legend */}
      <div
        className="mt-4 flex flex-wrap justify-center gap-2"
        role="list"
        aria-label={t("ariaList")}
      >
        {legendItems.map((item) => (
          <div
            key={item.key}
            className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white border border-slate-200 text-xs shadow-sm"
            role="listitem"
          >
            <span aria-hidden="true">{item.emoji}</span>
            <span className="text-slate-600">{item.label}</span>
            <span className="font-semibold text-slate-900">Lv.{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 深い比較のためのカスタム比較関数
function areEqual(prevProps: SkillChartProps, nextProps: SkillChartProps): boolean {
  const prevCat = prevProps.categories;
  const nextCat = nextProps.categories;
  
  return SKILL_KEYS.every((key) => prevCat[key] === nextCat[key]);
}

export const SkillChart = memo(SkillChartComponent, areEqual);
