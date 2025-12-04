"use client";

import { useState } from "react";
import type { JobMatchResult, SkillMapResult } from "@/types/skill";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ui/error-alert";
import { postJson } from "@/lib/apiClient";
import { logUsage } from "@/lib/usageLogger";

interface JobMatchSectionProps {
  result: SkillMapResult;
}

function ScoreGauge({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const getColor = (s: number) => {
    if (s >= 70) return { gradient: "from-emerald-400 to-teal-500", text: "text-emerald-600" };
    if (s >= 40) return { gradient: "from-amber-400 to-orange-500", text: "text-amber-600" };
    return { gradient: "from-red-400 to-rose-500", text: "text-red-600" };
  };
  
  const color = getColor(score);
  
  return (
    <div className="relative w-24 h-24">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="10"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="url(#matchGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="matchGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={score >= 70 ? "#34d399" : score >= 40 ? "#fbbf24" : "#f87171"} />
            <stop offset="100%" stopColor={score >= 70 ? "#14b8a6" : score >= 40 ? "#f97316" : "#e11d48"} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-bold ${color.text}`}>{score}</span>
        <span className="text-[10px] text-slate-500">/ 100</span>
      </div>
    </div>
  );
}

export function JobMatchSection({ result }: JobMatchSectionProps) {
  const [jdText, setJdText] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [match, setMatch] = useState<JobMatchResult | null>(null);

  const [sampleIndex, setSampleIndex] = useState(0);

  const jobSamples: string[] = [
    [
      "【募集職種】フロントエンドエンジニア（Next.js）",
      "",
      "【業務内容】",
      "- 自社SaaSプロダクトのフロントエンド開発（Next.js / TypeScript）",
      "- UI/UX デザイナーと連携した画面設計・実装",
      "- API 仕様策定およびバックエンドチームとの連携",
      "",
      "【必須スキル】",
      "- React もしくは Next.js を用いた Web アプリケーション開発経験 2年以上",
      "- TypeScript を用いた実務経験",
      "- Git を用いたチーム開発経験",
      "",
      "【歓迎スキル】",
      "- Tailwind CSS や shadcn/ui 等のコンポーネントライブラリ利用経験",
      "- Node.js / API 開発の知見",
      "- Supabase, Firebase など BaaS の利用経験"
    ].join("\n"),
    [
      "【募集職種】フルスタックエンジニア（React / Node.js）",
      "",
      "【業務内容】",
      "- 新規Webサービスのフロントエンド・バックエンド開発全般",
      "- 要件定義〜設計〜実装〜テスト〜リリースまで一貫して担当",
      "- パフォーマンス／セキュリティを考慮した設計・実装",
      "",
      "【必須スキル】",
      "- React を用いたフロントエンド開発経験",
      "- Node.js（Express / NestJS など）を用いたAPI開発経験",
      "- RDBMS（PostgreSQL / MySQL 等）の基本的な設計・運用経験",
      "",
      "【歓迎スキル】",
      "- AWS / GCP などクラウド環境でのサービス運用経験",
      "- CI/CD パイプラインの構築経験",
      "- チームリードまたはコードレビューの経験"
    ].join("\n"),
    [
      "【募集職種】バックエンドエンジニア（Go / Node.js）",
      "",
      "【業務内容】",
      "- マイクロサービスアーキテクチャにおける API 開発・運用",
      "- バッチ処理やジョブキューを用いた非同期処理の設計・実装",
      "- モニタリング基盤を活用したパフォーマンスチューニング",
      "",
      "【必須スキル】",
      "- Go または Node.js を用いたバックエンド開発経験 2年以上",
      "- Docker / コンテナ技術を用いた開発経験",
      "- REST / gRPC などのAPI設計経験",
      "",
      "【歓迎スキル】",
      "- Kubernetes 環境での運用経験",
      "- DDD などを用いたアーキテクチャ設計の経験",
      "- DevOps / SRE 的な取り組みへの関心"
    ].join("\n")
  ];

  const fillJobSample = () => {
    const next = (sampleIndex + 1) % jobSamples.length;
    setSampleIndex(next);
    setJdText(jobSamples[next] ?? "");
  };

  const handleMatch = async () => {
    setError(null);
    setMatch(null);
    if (!jdText.trim() && !jobUrl.trim()) {
      setError("求人票のテキストかURLのどちらかを入力してください。");
      return;
    }
    setLoading(true);
    try {
      void logUsage("job_match_clicked", {
        hasText: !!jdText.trim(),
        hasUrl: !!jobUrl.trim()
      });
      const data = await postJson<
        { skillMapId: string; jdText?: string; jobUrl?: string },
        JobMatchResult
      >("/api/job-match", {
        skillMapId: result.id,
        jdText: jdText.trim() || undefined,
        jobUrl: jobUrl.trim() || undefined
      });
      setMatch(data);
    } catch (e) {
      console.error(e);
      setError(
        "求人マッチングに失敗しました。内容を確認のうえ、時間をおいて再度お試しください。"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md">
            💼
          </span>
          求人票マッチングスコア
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-relaxed pt-4">
        <p className="text-xs text-slate-600 leading-relaxed">
          気になる求人票のテキスト or URL を貼ると、このスキルマップとのマッチング度合いと不足スキル、専用ロードマップを表示します。
        </p>

        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
            <span>📄</span>
            求人票テキスト
          </label>
          <div className="relative">
            <textarea
              className="w-full min-h-[140px] rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition-all duration-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 focus:outline-none resize-none"
              placeholder="求人票の本文をそのまま貼り付けてください（職務内容・必須/歓迎スキルなど）"
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                  e.preventDefault();
                  void handleMatch();
                }
              }}
            />
            <div className="absolute bottom-2 right-2 text-[10px] text-slate-400">
              ⌘+Enter で実行
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
            <span>🔗</span>
            求人URL
            <span className="font-normal text-slate-500">（任意）</span>
          </label>
          <input
            type="url"
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition-all duration-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 focus:outline-none"
            placeholder="例）https://example.com/job/frontend-engineer"
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
          />
        </div>

        {error && <ErrorAlert message={error} />}

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={handleMatch}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                AI がマッチング中...
              </>
            ) : (
              <>
                <span>✨</span>
                この求人とマッチングしてみる
              </>
            )}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={fillJobSample}
            disabled={loading}
          >
            💡 サンプル求人を入れてみる
          </Button>
        </div>

        {match && (
          <div className="mt-6 space-y-4 border-t border-slate-100 pt-6 animate-fade-in-up">
            {/* Score display */}
            <div className="flex items-center gap-6 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-purple-50/50">
              <ScoreGauge score={match.score} />
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  マッチングスコア
                </p>
                <p className="text-sm text-slate-700 mt-1">
                  {match.score >= 70 && "この求人との相性は良好です！"}
                  {match.score >= 40 && match.score < 70 && "いくつかのスキルを補強すると良さそうです"}
                  {match.score < 40 && "現時点では少しギャップがありそうです"}
                </p>
              </div>
            </div>

            {/* Matched skills */}
            {!!match.matchedSkills.length && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[10px]">✓</span>
                  マッチしているスキル
                </p>
                <div className="flex flex-wrap gap-2">
                  {match.matchedSkills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 px-3 py-1 text-xs font-medium text-emerald-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing skills */}
            {!!match.missingSkills.length && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-[10px]">!</span>
                  不足している/弱いスキル
                </p>
                <div className="flex flex-wrap gap-2">
                  {match.missingSkills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 px-3 py-1 text-xs font-medium text-amber-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Summary */}
            {match.summary && (
              <div className="p-4 rounded-xl bg-slate-50 space-y-2">
                <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <span>📋</span>
                  マッチングの要約
                </p>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {match.summary}
                </p>
              </div>
            )}

            {/* Roadmap */}
            {match.roadmapForJob && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 space-y-2">
                <p className="text-xs font-semibold text-purple-700 flex items-center gap-1.5">
                  <span>🛤️</span>
                  この求人に寄せるためのロードマップ
                </p>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {match.roadmapForJob}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
