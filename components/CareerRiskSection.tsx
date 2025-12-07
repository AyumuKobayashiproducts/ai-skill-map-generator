"use client";

import { useState } from "react";
import type { CareerRiskResult, SkillMapResult } from "@/types/skill";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ui/error-alert";
import { postJson, isApiClientError } from "@/lib/apiClient";
import { logUsage } from "@/lib/usageLogger";
import { useTranslations } from "next-intl";

interface CareerRiskSectionProps {
  result: SkillMapResult;
}

interface RiskBarProps {
  label: string;
  value: number;
  icon: string;
  color: string;
  description: string;
  levelLabels: {
    high: string;
    medium: string;
    low: string;
  };
}

function RiskBar({
  label,
  value,
  icon,
  color,
  description,
  levelLabels
}: RiskBarProps) {
  const getLevel = (v: number) => {
    if (v >= 70) return { text: levelLabels.high, bg: "bg-red-500" };
    if (v >= 40) return { text: levelLabels.medium, bg: "bg-amber-500" };
    return { text: levelLabels.low, bg: "bg-emerald-500" };
  };
  
  const level = getLevel(value);
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="text-sm font-medium text-slate-900">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            value >= 70 ? "bg-red-100 text-red-700" :
            value >= 40 ? "bg-amber-100 text-amber-700" :
            "bg-emerald-100 text-emerald-700"
          }`}>
            {level.text}
          </span>
          <span className="text-sm font-bold text-slate-900">{value}</span>
        </div>
      </div>
      <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
        <div 
          className={`h-full rounded-full ${color} transition-all duration-1000 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
  );
}

export function CareerRiskSection({ result }: CareerRiskSectionProps) {
  const t = useTranslations("result.career.risk");
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
    } catch (e: unknown) {
      console.error(e);
      if (isApiClientError(e)) {
        if (e.code === "RISK_NOT_FOUND") {
          setError(t("errors.skillMapNotFound"));
        } else if (e.code === "RISK_OPENAI_ERROR") {
          setError(t("errors.aiFailed"));
        } else {
          setError(e.message || t("errors.analyzeFailed"));
        }
      } else {
        setError(t("errors.analyzeFailed"));
      }
    } finally {
      setLoading(false);
    }
  };

  const riskItems = risk
    ? [
        {
          key: "obsolescence" as const,
          value: risk.obsolescence,
          icon: "📉",
          color: "bg-gradient-to-r from-red-400 to-rose-500"
        },
        {
          key: "busFactor" as const,
          value: risk.busFactor,
          icon: "👤",
          color: "bg-gradient-to-r from-amber-400 to-orange-500"
        },
        {
          key: "automation" as const,
          value: risk.automation,
          icon: "🤖",
          color: "bg-gradient-to-r from-purple-400 to-violet-500"
        }
      ]
    : [];

  const overallRisk = risk 
    ? Math.round((risk.obsolescence + risk.busFactor + risk.automation) / 3)
    : 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white shadow-md">
            ⚠️
          </span>
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-relaxed pt-4">
        <p className="text-xs text-slate-600 leading-relaxed">
          {t("description")}
        </p>

        {!risk && (
          <Button
            type="button"
            variant="outline"
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                {t("buttons.analyzing")}
              </>
            ) : (
              <>
                <span>🔍</span>
                {t("buttons.analyze")}
              </>
            )}
          </Button>
        )}

        {error && <ErrorAlert message={error} />}

        {risk && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Overall risk indicator */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-red-50/50">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                overallRisk >= 70 ? "bg-gradient-to-br from-red-500 to-rose-600" :
                overallRisk >= 40 ? "bg-gradient-to-br from-amber-500 to-orange-600" :
                "bg-gradient-to-br from-emerald-500 to-teal-600"
              }`}>
                {overallRisk}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {t("overall.label")}
                </p>
                <p className="text-sm text-slate-700 mt-1">
                  {overallRisk >= 70 && t("overall.high")}
                  {overallRisk >= 40 && overallRisk < 70 && t("overall.medium")}
                  {overallRisk < 40 && t("overall.low")}
                </p>
              </div>
            </div>

            {/* Individual risk bars */}
            <div className="space-y-4">
              {riskItems.map((item) => (
                <RiskBar
                  key={item.key}
                  label={t(`items.${item.key}.label`)}
                  description={t(`items.${item.key}.description`)}
                  value={item.value}
                  icon={item.icon}
                  color={item.color}
                  levelLabels={{
                    high: t("levels.high"),
                    medium: t("levels.medium"),
                    low: t("levels.low")
                  }}
                />
              ))}
            </div>

            {/* Summary */}
            <div className="p-4 rounded-xl bg-slate-50 space-y-2">
              <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <span>📋</span>
                {t("summaryTitle")}
              </p>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                {risk.summary}
              </p>
            </div>

            {/* Actions */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 space-y-2">
              <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                <span>💡</span>
                {t("actionsTitle")}
              </p>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {risk.actions}
              </p>
            </div>

            {/* Re-analyze button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAnalyze}
              disabled={loading}
            >
              <span>🔄</span>
              {t("buttons.reanalyze")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
