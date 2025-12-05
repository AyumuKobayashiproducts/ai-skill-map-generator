"use client";

import { useState } from "react";
import type { SkillMapResult, TodayTaskResult } from "@/types/skill";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ui/error-alert";
import { postJson } from "@/lib/apiClient";
import { logUsage } from "@/lib/usageLogger";

interface TodayTaskSectionProps {
  result: SkillMapResult;
}

export function TodayTaskSection({ result }: TodayTaskSectionProps) {
  const [hours, setHours] = useState(1.5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [task, setTask] = useState<TodayTaskResult | null>(null);

  const handleGenerate = async () => {
    setError(null);
    setLoading(true);
    try {
      void logUsage("today_task_clicked", { hours });
      const data = await postJson<
        { skillMapId: string; hours: number },
        TodayTaskResult
      >("/api/today-task", { skillMapId: result.id, hours });
      setTask(data);
    } catch (e) {
      console.error(e);
      setError(
        "今日のタスク生成に失敗しました。時間をおいてから、もう一度お試しください。"
      );
    } finally {
      setLoading(false);
    }
  };

  const steps =
    task?.steps
      ?.split(/\r?\n/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0) ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>今日やること</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-relaxed">
        <p className="text-xs text-muted-foreground leading-relaxed">
          ロードマップとスキルマップを元に、今日1日で取り組むべきタスクを1つだけ提案します。
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-medium">
              今日使える学習時間（時間）
            </label>
            <input
              type="number"
              min={0.5}
              max={8}
              step={0.5}
              className="w-24 rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value) || 1)}
            />
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "AI がタスクを選定中..." : "今日のタスクを決める"}
          </Button>
        </div>

        {error && <ErrorAlert message={error} />}

        {task && (
          <div className="mt-2 space-y-2 border-t pt-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                タイトル
              </p>
              <p className="text-sm font-medium">{task.title}</p>
              <p className="text-[11px] text-muted-foreground mt-1">
                目安時間: 約 {task.estimatedHours.toFixed(1)} 時間
              </p>
            </div>
            {task.description && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  内容
                </p>
                <p className="text-xs whitespace-pre-wrap leading-relaxed">
                  {task.description}
                </p>
              </div>
            )}
            {steps.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  手順の例
                </p>
                <ol className="list-decimal list-inside text-xs space-y-1">
                  {steps.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


