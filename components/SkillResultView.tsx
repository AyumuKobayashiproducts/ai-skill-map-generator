"use client";

import { useEffect, useState } from "react";
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
import { ErrorAlert } from "@/components/ui/error-alert";
import { postJson } from "@/lib/apiClient";

interface SkillResultViewProps {
  result: SkillMapResult;
  previousCategories?: SkillCategories;
}

function getMainClass(categories: SkillCategories) {
  const entries = Object.entries(categories).filter(
    ([, v]) => typeof v === "number"
  ) as [string, number][];
  if (entries.length === 0) return null;
  const first = entries.sort((a, b) => b[1] - a[1])[0];
  if (!first) return null;
  const [key, level] = first;

  const classMap: Record<string, { label: string; emoji: string }> = {
    frontend: { label: "フロントエンドメイジ", emoji: "🎨" },
    backend: { label: "バックエンドナイト", emoji: "⚔️" },
    infra: { label: "インフラガーディアン", emoji: "🛡️" },
    ai: { label: "AI アルケミスト", emoji: "🧪" },
    tools: { label: "ツールアーティスト", emoji: "🔧" }
  };

  return {
    key,
    level,
    label: classMap[key]?.label ?? key,
    emoji: classMap[key]?.emoji ?? "⭐"
  };
}

function getBadges(categories: SkillCategories): { name: string; color: string }[] {
  const badges: { name: string; color: string }[] = [];
  const { frontend = 0, backend = 0, infra = 0, ai = 0, tools = 0 } = categories;

  if (frontend >= 4 && backend >= 4) {
    badges.push({ name: "フルスタック見習い", color: "from-purple-500 to-pink-500" });
  }
  if (frontend >= 4 && tools >= 3) {
    badges.push({ name: "UI 職人", color: "from-amber-500 to-orange-500" });
  }
  if (ai >= 4) {
    badges.push({ name: "AI 使い魔", color: "from-cyan-500 to-blue-500" });
  }
  if (infra >= 3 && backend >= 3) {
    badges.push({ name: "信頼性エンジニア", color: "from-emerald-500 to-teal-500" });
  }
  if (badges.length === 0) {
    badges.push({ name: "成長中エンジニア", color: "from-slate-500 to-slate-600" });
  }

  return badges;
}

function ScoreCircle({ score }: { score: number }) {
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
        <span className="text-xs text-slate-500">/ 100</span>
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

  const [readiness, setReadiness] = useState<ReadinessScoreResult | null>(null);
  const [readinessError, setReadinessError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReadiness = async () => {
      try {
        const data = await postJson<{ skillMapId: string }, ReadinessScoreResult>(
          "/api/readiness",
          { skillMapId: result.id }
        );
        setReadiness(data);
      } catch (e) {
        console.error(e);
        setReadinessError(
          e instanceof Error ? e.message : "転職準備スコアの取得に失敗しました。"
        );
      }
    };

    fetchReadiness();
  }, [result.id]);

  const handleCopyMarkdown = async () => {
    const lines = [
      "# AI Skill Map",
      "",
      `- クラス: ${mainClass?.label ?? "N/A"} (Lv.${mainClass?.level ?? "-"})`,
      `- 強み: ${result.strengths}`,
      `- 弱み: ${result.weaknesses}`,
      nextSkills.length
        ? `- 次に学ぶと良いスキル: ${nextSkills.join(", ")}`
        : "",
      "",
      "## 30日ロードマップ",
      result.roadmap30,
      "",
      "## 90日ロードマップ",
      result.roadmap90
    ]
      .filter(Boolean)
      .join("\n");

    await navigator.clipboard.writeText(lines);
  };

  const handleCopyResumeTemplate = async () => {
    const lines = [
      "# 職務経歴書（ドラフト）",
      "",
      "## 1. プロフィール要約",
      `- クラス: ${mainClass?.label ?? "エンジニア"}（Lv.${mainClass?.level ?? "-"}）`,
      `- 強み: ${result.strengths || "未入力"}`,
      `- 弱み / 今後の伸ばしどころ: ${result.weaknesses || "未入力"}`,
      "",
      "## 2. 技術スタック（サマリ）",
      `- フロントエンド: レベル ${result.categories.frontend ?? 0}`,
      `- バックエンド: レベル ${result.categories.backend ?? 0}`,
      `- インフラ: レベル ${result.categories.infra ?? 0}`,
      `- AI / 機械学習: レベル ${result.categories.ai ?? 0}`,
      `- 開発ツール / ワークフロー: レベル ${result.categories.tools ?? 0}`,
      "",
      nextSkills.length
        ? `## 3. 今後フォーカスしたいスキル\n- ${nextSkills.join("\n- ")}`
        : "",
      "",
      "## 4. 30日プラン（学習・改善）",
      result.roadmap30 || "未入力",
      "",
      "## 5. 90日プラン（キャリアの方向性）",
      result.roadmap90 || "未入力"
    ]
      .filter(Boolean)
      .join("\n");

    await navigator.clipboard.writeText(lines);
  };

  const tabs = [
    { id: "overview", label: "概要", icon: "📊" },
    { id: "learning", label: "学習計画", icon: "📚" },
    { id: "career", label: "キャリア & 求人", icon: "💼" },
    { id: "export", label: "エクスポート", icon: "📤" }
  ];

  const renderTabs = () => (
    <div
      className="flex gap-1 p-1 bg-slate-100/80 rounded-xl mb-6 text-xs md:text-sm overflow-x-auto flex-nowrap -mx-2 px-2 md:mx-0"
      role="tablist"
      aria-label="スキルマップ結果のセクション切り替え"
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
              転職準備スコア
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
              <ScoreCircle score={readiness.score} />
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    readiness.level === "high"
                      ? "bg-emerald-100 text-emerald-700"
                      : readiness.level === "medium"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {readiness.level === "high" && "✨ すぐに動ける状態"}
                    {readiness.level === "medium" && "📈 準備しながら動ける状態"}
                    {readiness.level === "low" && "🌱 まずは土台固めが必要"}
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
              あなたのクラス
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-lg font-bold text-slate-900">
                {mainClass.label}
                <span className="ml-2 text-sm font-normal text-slate-500">
                  Lv.{mainClass.level}
                </span>
              </p>
              <p className="text-xs text-slate-600 mt-1">
                カテゴリの中で最もスコアが高い分野をベースにした、あなたの現在の「ジョブ」です。
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span
                  key={badge.name}
                  className={`inline-flex items-center rounded-full bg-gradient-to-r ${badge.color} text-white px-3 py-1.5 text-xs font-semibold shadow-md`}
                >
                  {badge.name}
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
                  今日のまとめ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700 leading-relaxed">
                  あなたは
                  <span className="font-semibold gradient-text">
                    {` ${mainClass.label} `}
                  </span>
                  タイプのエンジニアです。
                  <br />
                  直近では{" "}
                  <span className="font-medium text-sky-600">
                    {nextSkills.length ? `${nextSkills[0]} など` : "フロントエンドまわり"}
                  </span>
                  {" "}を伸ばしていくと、次のキャリアの選択肢が広がりそうです。
                </p>
              </CardContent>
            </Card>
          )}

          <section className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span>📈</span>
              スキルレーダーチャート
            </h3>
            <SkillChart categories={result.categories} />
          </section>

          {previousCategories && (
            <section className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span>📊</span>
                前回との比較
              </h3>
              <p className="text-xs text-slate-600">
                一つ前の解析結果と現在のスキルバランスを重ねて表示しています。
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
                  おすすめスキル
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
                  強み
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm">
                  {result.strengths || "（未入力）"}
                </p>
              </CardContent>
            </Card>
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-600">
                  <span>📌</span>
                  伸ばしどころ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm">
                  {result.weaknesses || "（未入力）"}
                </p>
              </CardContent>
            </Card>
          </div>

          <SkillStorySection result={result} />
        </div>
      )}

      {activeTab === "learning" && (
        <div className="space-y-6 animate-fade-in">
          <RoadmapView
            roadmap30={result.roadmap30 ?? ""}
            roadmap90={result.roadmap90 ?? ""}
          />
        </div>
      )}

      {activeTab === "career" && (
        <div className="space-y-6 animate-fade-in">
          <CareerRiskSection result={result} />
          <JobMatchSection result={result} />
        </div>
      )}

      {activeTab === "export" && (
        <div className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>📤</span>
                データをエクスポート
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">
                スキルマップのデータを各種形式でコピーできます。
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" onClick={handleCopyMarkdown}>
                  📋 Markdown としてコピー
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () =>
                    navigator.clipboard.writeText(JSON.stringify(result, null, 2))
                  }
                >
                  📋 JSON をコピー
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyResumeTemplate}
                >
                  📄 職務経歴書テンプレートをコピー
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
