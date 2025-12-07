"use client";

import { useState } from "react";
import type { SkillMapResult, TimeSimulationResult } from "@/types/skill";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ui/error-alert";
import { postJson, isApiClientError } from "@/lib/apiClient";
import { logUsage } from "@/lib/usageLogger";
import { useTranslations } from "next-intl";

interface TimeSimulatorSectionProps {
  result: SkillMapResult;
}

export function TimeSimulatorSection({ result }: TimeSimulatorSectionProps) {
  const t = useTranslations("timeSim");
  const [weekdayHours, setWeekdayHours] = useState(1);
  const [weekendHours, setWeekendHours] = useState(2);
  const [months, setMonths] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<TimeSimulationResult | null>(null);

  const handleSimulate = async () => {
    setError(null);
    setLoading(true);
    try {
      void logUsage("time_simulate_clicked", {
        weekdayHours,
        weekendHours,
        months
      });
      const data = await postJson<
        { skillMapId: string; weekdayHours: number; weekendHours: number; months: number },
        TimeSimulationResult
      >("/api/time-simulate", {
        skillMapId: result.id,
        weekdayHours,
        weekendHours,
        months
      });
      setPlan(data);
    } catch (e: unknown) {
      console.error(e);
      if (isApiClientError(e)) {
        if (e.code === "TIME_SIM_NOT_FOUND") {
          setError(t("errors.skillMapNotFound"));
        } else if (e.code === "TIME_SIM_OPENAI_ERROR") {
          setError(t("errors.aiFailed"));
        } else {
          setError(e.message || t("errors.simulateFailed"));
        }
      } else {
        setError(t("errors.simulateFailed"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("hero.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-relaxed">
        <p className="text-xs text-muted-foreground leading-relaxed">
          {t("hero.body")}
        </p>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-1">
            <label className="block text-xs font-medium">
              {t("form.weekdayLabel")}
            </label>
            <input
              type="number"
              min={0}
              max={8}
              className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={weekdayHours}
              onChange={(e) => setWeekdayHours(Number(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium">
              {t("form.weekendLabel")}
            </label>
            <input
              type="number"
              min={0}
              max={12}
              className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={weekendHours}
              onChange={(e) => setWeekendHours(Number(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium">
              {t("form.monthsLabel")}
            </label>
            <input
              type="number"
              min={1}
              max={12}
              className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={months}
              onChange={(e) => setMonths(Number(e.target.value) || 1)}
            />
          </div>
        </div>

        {error && <ErrorAlert message={error} />}

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleSimulate}
          disabled={loading}
        >
          {loading ? t("button.simulating") : t("button.simulate")}
        </Button>

        {plan && (
          <div className="space-y-3 border-t pt-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                {t("result.realistic")}
              </p>
              <p className="text-xs whitespace-pre-wrap">
                {plan.realisticPlan}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                {t("result.ideal")}
              </p>
              <p className="text-xs whitespace-pre-wrap">{plan.idealPlan}</p>
            </div>
            {plan.notes && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  {t("result.notes")}
                </p>
                <p className="text-xs whitespace-pre-wrap">{plan.notes}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


