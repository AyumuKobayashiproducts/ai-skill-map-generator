"use client";

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
import type { SkillCategories } from "@/types/skill";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface ComparisonChartProps {
  current: SkillCategories;
  previous: SkillCategories;
}

const labelMap: Record<string, { label: string; emoji: string }> = {
  frontend: { label: "Frontend", emoji: "🎨" },
  backend: { label: "Backend", emoji: "⚔️" },
  infra: { label: "Infra", emoji: "🛡️" },
  ai: { label: "AI", emoji: "🧪" },
  tools: { label: "Tools", emoji: "🔧" }
};

export function ComparisonChart({ current, previous }: ComparisonChartProps) {
  const keys = ["frontend", "backend", "infra", "ai", "tools"];
  const labels = keys.map((k) => `${labelMap[k]?.emoji} ${labelMap[k]?.label}`);

  const toArray = (c: SkillCategories) => keys.map((k) => c[k as keyof SkillCategories] ?? 0);

  const currentValues = toArray(current);
  const previousValues = toArray(previous);

  // 変化を計算
  const changes = keys.map((k, i) => ({
    key: k,
    label: labelMap[k]?.label ?? k,
    emoji: labelMap[k]?.emoji ?? "⭐",
    current: currentValues[i],
    previous: previousValues[i],
    diff: (currentValues[i] ?? 0) - (previousValues[i] ?? 0)
  }));

  const data = {
    labels,
    datasets: [
      {
        label: "今回",
        data: currentValues,
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "#3b82f6",
        borderWidth: 2.5,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#3b82f6",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: "前回",
        data: previousValues,
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderColor: "#10b981",
        borderWidth: 2,
        borderDash: [5, 5],
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#10b981",
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    animation: {
      duration: 1200,
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
          font: { size: 10 }
        },
        grid: { 
          color: "rgba(148, 163, 184, 0.2)",
          circular: true
        },
        angleLines: { color: "rgba(148, 163, 184, 0.3)" },
        pointLabels: {
          color: "#475569",
          font: { size: 11, weight: 500 },
          padding: 10
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
        cornerRadius: 8,
        padding: 10
      }
    }
  } as const;

  return (
    <div className="space-y-4">
      <div className="w-full max-w-sm md:max-w-md mx-auto">
        <Radar data={data} options={options} />
      </div>

      {/* Custom legend */}
      <div className="flex justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-xs text-slate-600">今回</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500 opacity-60" />
          <span className="text-xs text-slate-600">前回</span>
        </div>
      </div>

      {/* Changes summary */}
      <div className="grid grid-cols-5 gap-2">
        {changes.map((item) => (
          <div 
            key={item.key} 
            className="text-center p-2 rounded-lg bg-slate-50 border border-slate-100"
          >
            <span className="text-sm">{item.emoji}</span>
            <p className="text-[10px] text-slate-500 mt-1">{item.label}</p>
            <p className={`text-xs font-bold mt-0.5 ${
              item.diff > 0 
                ? "text-emerald-600" 
                : item.diff < 0 
                ? "text-red-500" 
                : "text-slate-400"
            }`}>
              {item.diff > 0 && "+"}
              {item.diff !== 0 ? item.diff : "→"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
