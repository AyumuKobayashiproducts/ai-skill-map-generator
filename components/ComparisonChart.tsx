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

export function ComparisonChart({ current, previous }: ComparisonChartProps) {
  const labels = ["Frontend", "Backend", "Infra", "AI", "Tools"];

  const toArray = (c: SkillCategories) => [
    c.frontend ?? 0,
    c.backend ?? 0,
    c.infra ?? 0,
    c.ai ?? 0,
    c.tools ?? 0
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "今回",
        data: toArray(current),
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(59, 130, 246, 1)"
      },
      {
        label: "前回",
        data: toArray(previous),
        backgroundColor: "rgba(16, 185, 129, 0.15)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(16, 185, 129, 1)"
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 5,
        ticks: { stepSize: 1, color: "#9CA3AF", backdropColor: "transparent" },
        grid: { color: "rgba(148, 163, 184, 0.3)" },
        angleLines: { color: "rgba(148, 163, 184, 0.4)" },
        pointLabels: {
          color: "#4B5563",
          font: { size: 11 }
        }
      }
    }
  } as const;

  return (
    <div className="w-full max-w-sm md:max-w-md mx-auto">
      <Radar data={data} options={options} />
    </div>
  );
}


