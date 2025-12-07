"use client";

import { useState } from "react";
import type { SkillMapResult, TodayTaskResult } from "@/types/skill";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ui/error-alert";
import { postJson, isApiClientError } from "@/lib/apiClient";
import { logUsage } from "@/lib/usageLogger";
import { useTranslations } from "next-intl";

interface TodayTaskSectionProps {
  result: SkillMapResult;
}

const timeOptions = [
  { value: 0.5, key: "30m" as const, emoji: "⚡" },
  { value: 1, key: "1h" as const, emoji: "☕" },
  { value: 1.5, key: "1_5h" as const, emoji: "📖" },
  { value: 2, key: "2h" as const, emoji: "💪" },
  { value: 3, key: "3h" as const, emoji: "🔥" },
  { value: 4, key: "4h" as const, emoji: "🚀" }
];

export function TodayTaskSection({ result }: TodayTaskSectionProps) {
  const t = useTranslations("result.todayTask");
  const [hours, setHours] = useState(1.5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [task, setTask] = useState<TodayTaskResult | null>(null);
  const [completed, setCompleted] = useState(false);

  const handleGenerate = async () => {
    setError(null);
    setLoading(true);
    setCompleted(false);
    try {
      void logUsage("today_task_clicked", { hours });
      const data = await postJson<
        { skillMapId: string; hours: number },
        TodayTaskResult
      >("/api/today-task", { skillMapId: result.id, hours });
      setTask(data);
    } catch (e: unknown) {
      console.error(e);
      if (isApiClientError(e)) {
        if (e.code === "TODAY_TASK_NOT_FOUND") {
          setError(t("errors.skillMapNotFound"));
        } else if (e.code === "TODAY_TASK_OPENAI_ERROR") {
          setError(t("errors.aiFailed"));
        } else {
          setError(e.message || t("errors.generateFailed"));
        }
      } else {
        setError(t("errors.generateFailed"));
      }
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
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-cyan-50 to-sky-50">
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center text-white shadow-md">
            📋
          </span>
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <p className="text-xs text-slate-600 leading-relaxed">
          {t("description")}
        </p>

        {/* Time selector */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <span>⏰</span>
            {t("timeLabel")}
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {timeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setHours(option.value)}
                className={`p-2 rounded-xl border-2 text-center transition-all duration-200 ${
                  hours === option.value
                    ? "border-sky-400 bg-sky-50 shadow-md"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <span className="text-lg">{option.emoji}</span>
                <p className={`text-xs mt-1 font-medium ${
                  hours === option.value ? "text-sky-700" : "text-slate-600"
                }`}>
                  {t(`timeOptions.${option.key}`)}
                </p>
              </button>
            ))}
          </div>
        </div>

        <Button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {t("buttons.generating")}
            </>
          ) : (
            <>
              <span>✨</span>
              {t("buttons.generate")}
            </>
          )}
        </Button>

        {error && <ErrorAlert message={error} />}

        {task && (
          <div className="space-y-4 pt-4 border-t border-slate-100 animate-fade-in-up">
            {/* Task card */}
            <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
              completed 
                ? "border-emerald-300 bg-emerald-50" 
                : "border-sky-200 bg-gradient-to-r from-sky-50 to-cyan-50"
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{completed ? "✅" : "🎯"}</span>
                    <h4 className={`text-base font-bold ${
                      completed ? "text-emerald-700 line-through" : "text-slate-900"
                    }`}>
                      {task.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200">
                  {t("task.estimated", {
                    hours: task.estimatedHours.toFixed(1)
                  })}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCompleted(!completed)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    completed
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-slate-300 hover:border-emerald-400"
                  }`}
                >
                  {completed && "✓"}
                </button>
              </div>
            </div>

            {/* Description */}
            {task.description && (
              <div className="p-4 rounded-xl bg-slate-50 space-y-2">
                <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <span>📝</span>
                  {t("task.descriptionTitle")}
                </p>
                <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                  {task.description}
                </p>
              </div>
            )}

            {/* Steps */}
            {steps.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <span>📋</span>
                  {t("task.stepsTitle")}
                </p>
                <div className="space-y-2">
                  {steps.map((s, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-start gap-3 p-3 rounded-lg bg-white border border-slate-100 animate-fade-in-up"
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-sm text-slate-700 pt-0.5">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed message */}
            {completed && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 text-center animate-scale-in">
                <span className="text-3xl">🎉</span>
                <p className="text-sm font-semibold text-emerald-700 mt-2">
                  {t("completed.title")}
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  {t("completed.subtitle")}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
