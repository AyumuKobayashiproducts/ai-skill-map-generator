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
import { OneOnOnePracticeSection } from "@/components/OneOnOnePracticeSection";
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

  const classMap: Record<string, string> = {
    frontend: "フロントエンドメイジ",
    backend: "バックエンドナイト",
    infra: "インフラガーディアン",
    ai: "AI アルケミスト",
    tools: "ツールアーティスト"
  };

  return {
    key,
    level,
    label: classMap[key] ?? key
  };
}

function getBadges(categories: SkillCategories): string[] {
  const badges: string[] = [];
  const { frontend = 0, backend = 0, infra = 0, ai = 0, tools = 0 } = categories;

  if (frontend >= 4 && backend >= 4) {
    badges.push("フルスタック見習い");
  }
  if (frontend >= 4 && tools >= 3) {
    badges.push("UI 職人");
  }
  if (ai >= 4) {
    badges.push("AI 使い魔");
  }
  if (infra >= 3 && backend >= 3) {
    badges.push("信頼性エンジニア");
  }
  if (badges.length === 0) {
    badges.push("成長中エンジニア");
  }

  return badges;
}

export function SkillResultView({
  result,
  previousCategories
}: SkillResultViewProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "learning" | "career" | "interview" | "export"
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

  const renderTabs = () => (
    <div
      className="flex gap-2 border-b pb-2 mb-4 text-xs md:text-sm overflow-x-auto flex-nowrap -mx-2 px-2 md:mx-0 md:px-0"
      role="tablist"
      aria-label="スキルマップ結果のセクション切り替え"
    >
      {[
        { id: "overview", label: "概要" },
        { id: "learning", label: "学習計画" },
        { id: "career", label: "キャリア & 求人" },
        { id: "interview", label: "面接練習" },
        { id: "export", label: "エクスポート" }
      ].map((tab) => {
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
            className={`rounded-full px-3 py-1 border text-xs md:text-sm transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:bg-muted"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6 leading-relaxed">
      {renderTabs()}

      {readiness && (
        <Card id="tab-panel-overview" role="tabpanel" aria-labelledby="overview">
          <CardHeader>
            <CardTitle>転職準備スコア</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-3xl font-semibold text-slate-900">
                {readiness.score}
                <span className="text-base font-normal text-slate-500">
                  {" "}
                  / 100
                </span>
              </p>
              <p className="text-xs mt-1 text-slate-500">
                レベル:{" "}
                {readiness.level === "high"
                  ? "高い（すぐに動ける状態）"
                  : readiness.level === "medium"
                  ? "標準（準備しながら動ける状態）"
                  : "要準備（まずは土台固めが必要）"}
              </p>
            </div>
            <p className="text-xs text-slate-600 md:max-w-md">
              {readiness.comment}
            </p>
          </CardContent>
        </Card>
      )}

      {readinessError && (
        <p className="text-xs text-red-600">{readinessError}</p>
      )}

      {mainClass && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>あなたのクラス</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">
                {mainClass.label} <span className="text-xs">Lv.{mainClass.level}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                カテゴリの中で最もスコアが高い分野をベースにした、あなたの現在の「ジョブ」です。
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center rounded-full bg-primary text-primary-foreground px-3 py-1 text-[11px] font-medium shadow-sm"
                >
                  {badge}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "overview" && (
        <div className="space-y-6">
          {mainClass && (
            <Card>
              <CardHeader>
                <CardTitle>今日のまとめ</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700 leading-relaxed">
                  あなたは
                  <span className="font-semibold">
                    {` ${mainClass.label} `}
                  </span>
                  タイプのエンジニアです。
                  <br />
                  直近では{" "}
                  {nextSkills.length
                    ? `${nextSkills[0]} など`
                    : "フロントエンドまわり"}{" "}
                  を伸ばしていくと、次のキャリアの選択肢が広がりそうです。
                </p>
              </CardContent>
            </Card>
          )}
            <section className="space-y-3">
            <h3 className="text-lg font-semibold">スキルレーダーチャート</h3>
            <SkillChart categories={result.categories} />
          </section>

          {previousCategories && (
            <section className="space-y-3">
              <h3 className="text-lg font-semibold">前回との比較</h3>
              <p className="text-xs text-muted-foreground">
                一つ前の解析結果と現在のスキルバランスを重ねて表示しています。
              </p>
              <ComparisonChart
                current={result.categories}
                previous={previousCategories}
              />
            </section>
          )}

          {nextSkills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>おすすめスキル</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {nextSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>強み</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm">
                  {result.strengths || "（未入力）"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>弱み</CardTitle>
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
        <div className="space-y-6">
          <RoadmapView
            roadmap30={result.roadmap30 ?? ""}
            roadmap90={result.roadmap90 ?? ""}
          />
        </div>
      )}

      {activeTab === "career" && (
        <div className="space-y-6">
          <CareerRiskSection result={result} />
          <JobMatchSection result={result} />
        </div>
      )}

      {activeTab === "interview" && (
        <div className="space-y-6">
          <OneOnOnePracticeSection result={result} />
        </div>
      )}

      {activeTab === "export" && (
        <div className="space-y-4">
          <section className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" onClick={handleCopyMarkdown}>
              Markdown としてコピー
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () =>
                navigator.clipboard.writeText(JSON.stringify(result, null, 2))
              }
            >
              JSON をコピー
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyResumeTemplate}
            >
              職務経歴書テンプレートをコピー
            </Button>
          </section>
        </div>
      )}
    </div>
  );
}


