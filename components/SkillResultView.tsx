"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/src/i18n/config";
import type {
  SkillCategories,
  SkillMapResult,
  ReadinessScoreResult
} from "@/types/skill";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SkillChart } from "@/components/SkillChart";
import { RoadmapView } from "@/components/RoadmapView";
import { ComparisonChart } from "@/components/ComparisonChart";
import { Button } from "@/components/ui/button";
import { SkillStorySection } from "@/components/SkillStorySection";
import { JobMatchSection } from "@/components/JobMatchSection";
import { CareerRiskSection } from "@/components/CareerRiskSection";
import { OneOnOnePracticeSection } from "@/components/OneOnOnePracticeSection";
import { ErrorAlert } from "@/components/ui/error-alert";
import { postJson, isApiClientError } from "@/lib/apiClient";
import { TodayTaskSection } from "@/components/TodayTaskSection";

interface SkillResultViewProps {
  result: SkillMapResult;
  previousCategories?: SkillCategories;
}

const classEmojiMap: Record<string, string> = {
  frontend: "🎨",
  backend: "⚔️",
  infra: "🛡️",
  ai: "🧪",
  tools: "🔧"
};

function getMainClass(categories: SkillCategories) {
  const entries = Object.entries(categories).filter(
    ([, v]) => typeof v === "number"
  ) as [string, number][];
  if (entries.length === 0) return null;
  const first = entries.sort((a, b) => b[1] - a[1])[0];
  if (!first) return null;
  const [key, level] = first;

  return {
    key,
    level,
    emoji: classEmojiMap[key] ?? "⭐"
  };
}

function getBadges(categories: SkillCategories): { id: string; color: string }[] {
  const badges: { id: string; color: string }[] = [];
  const { frontend = 0, backend = 0, infra = 0, ai = 0, tools = 0 } = categories;

  if (frontend >= 4 && backend >= 4) {
    badges.push({ id: "fullstack", color: "from-purple-500 to-pink-500" });
  }
  if (frontend >= 4 && tools >= 3) {
    badges.push({ id: "ui", color: "from-amber-500 to-orange-500" });
  }
  if (ai >= 4) {
    badges.push({ id: "ai", color: "from-cyan-500 to-blue-500" });
  }
  if (infra >= 3 && backend >= 3) {
    badges.push({ id: "reliability", color: "from-emerald-500 to-teal-500" });
  }
  if (badges.length === 0) {
    badges.push({ id: "growing", color: "from-slate-500 to-slate-600" });
  }

  return badges;
}

function ScoreCircle({ score, label }: { score: number; label: string }) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  return (
    <div className="relative w-28 h-28">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
          style={{ 
            animation: "progress-circle 1.5s ease-out forwards",
            strokeDashoffset: circumference
          }}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-slate-900">{score}</span>
        <span className="text-xs text-slate-500">{label}</span>
      </div>
      <style jsx>{`
        @keyframes progress-circle {
          to {
            stroke-dashoffset: ${strokeDashoffset};
          }
        }
      `}</style>
    </div>
  );
}

function ProgressBar({ value, max = 100 }: { value: number; max?: number }) {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className="progress-bar">
      <div 
        className="progress-bar-fill"
        style={{ width: `${percentage}%` }}
      >
        <div className="progress-bar-shimmer" />
      </div>
    </div>
  );
}

export function SkillResultView({
  result,
  previousCategories
}: SkillResultViewProps) {
  const t = useTranslations("result");
  const [activeTab, setActiveTab] = useState<
    "overview" | "learning" | "career" | "export"
  >("overview");
  const nextSkills =
    result.nextSkills ??
    (Array.isArray(result.chartData?.nextSkills)
      ? (result.chartData.nextSkills as string[])
      : []);

  const mainClass = getMainClass(result.categories);
  const badges = getBadges(result.categories);
  const mainClassLabel = mainClass
    ? t(`classNames.${mainClass.key}`)
    : "";

  const [readiness, setReadiness] = useState<ReadinessScoreResult | null>(null);
  const [readinessError, setReadinessError] = useState<string | null>(null);
  const locale = useLocale() as Locale;

  useEffect(() => {
    const fetchReadiness = async () => {
      try {
        const data = await postJson<
          { skillMapId: string; locale?: Locale },
          ReadinessScoreResult
        >("/api/readiness", {
          skillMapId: result.id,
          locale
        });
        setReadiness(data);
      } catch (e: unknown) {
        console.error(e);
        if (isApiClientError(e)) {
          if (e.code === "READINESS_NOT_FOUND") {
            setReadinessError(t("readiness.errorSkillMapNotFound"));
          } else if (e.code === "READINESS_OPENAI_ERROR") {
            setReadinessError(t("readiness.errorAiFailed"));
          } else {
            setReadinessError(e.message || t("readiness.errorFetchDefault"));
          }
        } else {
          setReadinessError(t("readiness.errorFetchDefault"));
        }
      }
    };

    fetchReadiness();
  }, [result.id, t, locale]);

  const handleCopyMarkdown = async () => {
    const strengthsText = result.strengths || t("overview.notProvided");
    const weaknessesText = result.weaknesses || t("overview.notProvided");
    const classLabelForExport =
      mainClassLabel || t("classNames.frontend");

    const lines = [
      t("export.markdown.title"),
      "",
      t("export.markdown.classLine", {
        classLabel: classLabelForExport,
        level: mainClass?.level ?? "-"
      }),
      t("export.markdown.strengthsLine", { strengths: strengthsText }),
      t("export.markdown.weaknessesLine", { weaknesses: weaknessesText }),
      nextSkills.length
        ? t("export.markdown.nextSkillsLine", {
            skills: nextSkills.join(", ")
          })
        : "",
      "",
      t("export.markdown.roadmap30Title"),
      result.roadmap30,
      "",
      t("export.markdown.roadmap90Title"),
      result.roadmap90
    ]
      .filter(Boolean)
      .join("\n");

    await navigator.clipboard.writeText(lines);
  };

  const handleCopyResumeTemplate = async () => {
    const strengthsText = result.strengths || t("overview.notProvided");
    const weaknessesText = result.weaknesses || t("overview.notProvided");
    const classLabelForExport =
      mainClassLabel || t("classNames.frontend");

    const lines = [
      t("export.resume.title"),
      "",
      t("export.resume.profileTitle"),
      t("export.resume.profileClassLine", {
        classLabel: classLabelForExport || t("classNames.frontend"),
        level: mainClass?.level ?? "-"
      }),
      t("export.resume.profileStrengthsLine", {
        strengths: strengthsText
      }),
      t("export.resume.profileWeaknessesLine", {
        weaknesses: weaknessesText
      }),
      "",
      t("export.resume.stackTitle"),
      t("export.resume.stackFrontend", {
        value: result.categories.frontend ?? 0
      }),
      t("export.resume.stackBackend", {
        value: result.categories.backend ?? 0
      }),
      t("export.resume.stackInfra", {
        value: result.categories.infra ?? 0
      }),
      t("export.resume.stackAi", {
        value: result.categories.ai ?? 0
      }),
      t("export.resume.stackTools", {
        value: result.categories.tools ?? 0
      }),
      "",
      nextSkills.length
        ? [
            t("export.resume.nextSkillsTitle"),
            ...nextSkills.map((skill) =>
              t("export.resume.nextSkillsItem", { skill })
            )
          ].join("\n")
        : "",
      "",
      t("export.resume.plan30Title"),
      result.roadmap30 || t("overview.notProvided"),
      "",
      t("export.resume.plan90Title"),
      result.roadmap90 || t("overview.notProvided")
    ]
      .filter(Boolean)
      .join("\n");

    await navigator.clipboard.writeText(lines);
  };

  const tabs = [
    { id: "overview", label: t("tabs.overview"), icon: "📊" },
    { id: "learning", label: t("tabs.learning"), icon: "📚" },
    { id: "career", label: t("tabs.career"), icon: "💼" },
    { id: "export", label: t("tabs.export"), icon: "📤" }
  ];

  const renderTabs = () => (
    <div
      className="flex gap-1 p-1 bg-slate-100/80 rounded-xl mb-6 text-xs md:text-sm overflow-x-auto flex-nowrap -mx-2 px-2 md:mx-0"
      role="tablist"
      aria-label={t("tabs.ariaLabel")}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`tab-panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() =>
              setActiveTab(tab.id as typeof activeTab)
            }
            className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs md:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              isActive
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            <span className={`transition-transform duration-200 ${isActive ? "scale-110" : ""}`}>
              {tab.icon}
            </span>
            {tab.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6 leading-relaxed">
      {renderTabs()}

      {/* 転職準備スコア - 常に表示 */}
      {readiness && (
        <Card className="animate-fade-in-up overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-emerald-50 opacity-50" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">🎯</span>
              {t("readiness.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
              <ScoreCircle
                score={readiness.score}
                label={t("readiness.scoreOutOf", { max: 100 })}
              />
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    readiness.level === "high"
                      ? "bg-emerald-100 text-emerald-700"
                      : readiness.level === "medium"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {readiness.level === "high" && t("readiness.levelHigh")}
                    {readiness.level === "medium" && t("readiness.levelMedium")}
                    {readiness.level === "low" && t("readiness.levelLow")}
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {readiness.comment}
                </p>
                <ProgressBar value={readiness.score} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {readinessError && <ErrorAlert message={readinessError} />}

      {/* クラスカード */}
      {mainClass && (
        <Card className="animate-fade-in-up stagger-1 border-2 border-sky-200/50 bg-gradient-to-br from-sky-50/80 via-white to-indigo-50/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">{mainClass.emoji}</span>
              {t("classCard.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-lg font-bold text-slate-900">
                {mainClassLabel}
                <span className="ml-2 text-sm font-normal text-slate-500">
                  Lv.{mainClass.level}
                </span>
              </p>
              <p className="text-xs text-slate-600 mt-1">
                {t("classCard.description")}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span
                  key={badge.id}
                  className={`inline-flex items-center rounded-full bg-gradient-to-r ${badge.color} text-white px-3 py-1.5 text-xs font-semibold shadow-md`}
                >
                  {t(`badgeNames.${badge.id}`)}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "overview" && (
        <div className="space-y-6 animate-fade-in">
          {mainClass && (
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>📝</span>
                  {t("summary.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {t(
                    nextSkills.length > 0
                      ? "summary.bodyWithSkill"
                      : "summary.bodyNoSkill",
                    {
                      classLabel: ` ${mainClassLabel} `,
                      firstSkill: nextSkills[0] ?? ""
                    }
                  )}
                  <span className="font-semibold gradient-text">
                    {` ${mainClassLabel} `}
                  </span>
                </p>
              </CardContent>
            </Card>
          )}

          <section className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span>📈</span>
              {t("overview.radarTitle")}
            </h3>
            <SkillChart categories={result.categories} />
          </section>

          {previousCategories && (
            <section className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span>📊</span>
                {t("overview.comparisonTitle")}
              </h3>
              <p className="text-xs text-slate-600">
                {t("overview.comparisonDescription")}
              </p>
              <ComparisonChart
                current={result.categories}
                previous={previousCategories}
              />
            </section>
          )}

          {nextSkills.length > 0 && (
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>🚀</span>
                  {t("overview.recommendTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {nextSkills.map((skill, idx) => (
                    <span
                      key={skill}
                      className="inline-flex items-center rounded-full bg-gradient-to-r from-sky-100 to-indigo-100 px-3 py-1.5 text-xs font-medium text-sky-700 border border-sky-200/50 animate-fade-in-up"
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-600">
                  <span>💪</span>
                  {t("overview.strengthsTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm">
                  {result.strengths || t("overview.notProvided")}
                </p>
              </CardContent>
            </Card>
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-600">
                  <span>📌</span>
                  {t("overview.weaknessesTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm">
                  {result.weaknesses || t("overview.notProvided")}
                </p>
              </CardContent>
            </Card>
          </div>

          <SkillStorySection result={result} />
        </div>
      )}

      {activeTab === "learning" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid gap-4 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-start">
            <RoadmapView
              roadmap30={result.roadmap30 ?? ""}
              roadmap90={result.roadmap90 ?? ""}
            />
            <TodayTaskSection result={result} />
          </div>
        </div>
      )}

      {activeTab === "career" && (
        <div className="space-y-6 animate-fade-in">
          <CareerRiskSection result={result} />
          <JobMatchSection result={result} />
          <OneOnOnePracticeSection result={result} />
        </div>
      )}

      {activeTab === "export" && (
        <div className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>📤</span>
                {t("export.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">
                {t("export.description")}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" onClick={handleCopyMarkdown}>
                  {t("export.buttons.copyMarkdown")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () =>
                    navigator.clipboard.writeText(JSON.stringify(result, null, 2))
                  }
                >
                  {t("export.buttons.copyJson")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyResumeTemplate}
                >
                  {t("export.buttons.copyResume")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
