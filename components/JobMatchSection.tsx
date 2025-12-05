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
    // TypeScript 上は undefined になる可能性があるので空文字をフォールバック
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
    <Card>
      <CardHeader>
        <CardTitle>求人票マッチングスコア</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-relaxed">
        <p className="text-xs text-muted-foreground leading-relaxed">
          気になる求人票のテキスト or URL を貼ると、このスキルマップとのマッチング度合いと不足スキル、専用ロードマップを表示します。
        </p>

        <div className="space-y-1">
          <label className="block text-xs font-medium">
            求人票テキスト（職務内容・必須/歓迎スキルなど）
          </label>
          <textarea
            className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="求人票の本文をそのまま貼り付けてください。"
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                void handleMatch();
              }
            }}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium">
            求人URL（任意・テキストの代わり）
          </label>
          <input
            type="url"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="例）https://example.com/job/frontend-engineer"
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
          />
        </div>

        {error && <ErrorAlert message={error} />}

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            onClick={handleMatch}
            disabled={loading}
          >
            {loading ? "AI がマッチング中..." : "この求人とマッチングしてみる"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={fillJobSample}
            disabled={loading}
          >
            サンプル求人を入れてみる
          </Button>
        </div>

        {match && (
          <div className="mt-4 space-y-3 border-t pt-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                マッチングスコア
              </p>
              <p className="text-2xl font-bold">
                {match.score}
                <span className="text-base font-normal text-muted-foreground">
                  {" "}
                  / 100
                </span>
              </p>
            </div>

            {!!match.matchedSkills.length && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  マッチしているスキル
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {match.matchedSkills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {!!match.missingSkills.length && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  不足している/弱いスキル
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {match.missingSkills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {match.summary && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  マッチングの要約
                </p>
                <p className="text-xs whitespace-pre-wrap">{match.summary}</p>
              </div>
            )}

            {match.roadmapForJob && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  この求人に寄せるためのロードマップ
                </p>
                <p className="text-xs whitespace-pre-wrap">
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


