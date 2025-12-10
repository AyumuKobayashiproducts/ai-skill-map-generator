"use client";

import { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartProps {
  labels: string[];
  data: number[];
}

export function RadarChart({ labels, data }: RadarChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Skill Level",
        data,
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "rgba(59, 130, 246, 0.8)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(17, 17, 19, 0.95)",
        titleColor: "#fafafa",
        bodyColor: "#a1a1aa",
        borderColor: "rgba(39, 39, 42, 1)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context: { raw: unknown }) => {
            const value = context.raw as number;
            return `Score: ${value}`;
          },
        },
      },
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        beginAtZero: true,
        angleLines: {
          color: "rgba(63, 63, 70, 0.3)",
          lineWidth: 1,
        },
        grid: {
          color: "rgba(63, 63, 70, 0.3)",
          circular: true,
        },
        pointLabels: {
          color: "#a1a1aa",
          font: {
            size: 12,
            weight: 500,
            family: "Geist, Inter, sans-serif",
          },
          padding: 16,
        },
        ticks: {
          display: false,
          stepSize: 20,
        },
      },
    },
    elements: {
      line: {
        tension: 0.1,
      },
    },
  };

  return (
    <div className="radar-container animate-scale-in">
      <div className="aspect-square max-w-md mx-auto">
        <Radar data={chartData} options={options} />
      </div>
    </div>
  );
}

