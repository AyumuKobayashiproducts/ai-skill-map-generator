"use client";

import { useState } from "react";
import type { CareerRiskResult, SkillMapResult } from "@/types/skill";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ui/error-alert";
import { postJson } from "@/lib/apiClient";
import { logUsage } from "@/lib/usageLogger";

// Chart.js でレーダーチャートを使うための登録
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface CareerRiskSectionProps {
  result: SkillMapResult;
}

export function CareerRiskSection({ result }: CareerRiskSectionProps) {
  const [risk, setRisk] = useState<CareerRiskResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setError(null);
    setLoading(true);
    try {
      void logUsage("career_risk_clicked");
      const data = await postJson<{ skillMapId: string }, CareerRiskResult>(
        "/api/risk",
        { skillMapId: result.id }
      );
      setRisk(data);
    } catch (e) {
      console.error(e);
      setError(
        "キャリアリスク分析に失敗しました。時間をおいてから、もう一度お試しください。"
      );
    } finally {
      setLoading(false);
    }
  };

  // Chart.js の型と readonly 配列の相性が良くないため、ここは any で扱う
  const chartData: any =
    risk &&
    {
      labels: ["陳腐化リスク", "属人化リスク", "自動化リスク"],
      datasets: [
        {
          label: "キャリアリスク",
          data: [risk.obsolescence, risk.busFactor, risk.automation],
          backgroundColor: "rgba(248, 113, 113, 0.2)",
          borderColor: "rgba(248, 113, 113, 1)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(248, 113, 113, 1)"
        }
      ]
    };

  const chartOptions = {
    responsive: true,
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 20,
          color: "#9CA3AF",
          backdropColor: "transparent"
        },
        grid: { color: "rgba(148, 163, 184, 0.3)" },
        angleLines: { color: "rgba(148, 163, 184, 0.4)" },
        pointLabels: {
          color: "#4B5563",
          font: { size: 11 }
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
    <Card>
      <CardHeader>
        <CardTitle>キャリアリスクレーダー</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-relaxed">
        <p className="text-xs text-muted-foreground leading-relaxed">
          現在のスキル構成から、
          「技術の陳腐化」「属人化」「自動化される」リスクをスコア化し、
          どこを補強すると良いかを可視化します。
        </p>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? "AI が分析中..." : "キャリアリスクを分析する"}
        </Button>

        {error && <ErrorAlert message={error} />}

        {risk && chartData && (
          <div className="space-y-3">
            <div className="w-full max-w-md mx-auto">
              {/* 型の都合で any を使っているため、ここだけ型チェックを無視する */}
              {/* @ts-ignore */}
              <Radar data={chartData} options={chartOptions} />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                リスクの要約
              </p>
              <p className="text-xs whitespace-pre-wrap">{risk.summary}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                具体的なアクション
              </p>
              <p className="text-xs whitespace-pre-wrap">{risk.actions}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}