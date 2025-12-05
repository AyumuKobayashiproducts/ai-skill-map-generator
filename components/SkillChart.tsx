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

interface SkillChartProps {
  categories: SkillCategories;
}

export function SkillChart({ categories }: SkillChartProps) {
  const labels = ["Frontend", "Backend", "Infra", "AI", "Tools"];

  const dataValues = [
    categories.frontend ?? 0,
    categories.backend ?? 0,
    categories.infra ?? 0,
    categories.ai ?? 0,
    categories.tools ?? 0
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "スキルレベル",
        data: dataValues,
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(59, 130, 246, 1)"
      }
    ]
  };

  const options = {
    responsive: true,
    animation: {
      duration: 1200,
      easing: "easeOutQuad"
    },
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 5,
        ticks: {
          stepSize: 1,
          color: "#9CA3AF",
          backdropColor: "transparent"
        },
        grid: {
          color: "rgba(148, 163, 184, 0.3)"
        },
        angleLines: {
          color: "rgba(148, 163, 184, 0.4)"
        },
        pointLabels: {
          color: "#4B5563",
          font: {
            size: 11
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  } as const;

  return (
    <div className="w-full max-w-sm md:max-w-md mx-auto">
      <Radar data={data} options={options} />
    </div>
  );
}


