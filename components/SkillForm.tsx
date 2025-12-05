"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ui/error-alert";
import { postJson } from "@/lib/apiClient";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowserClient";
import { logUsage } from "@/lib/usageLogger";

export function SkillForm() {
  const [text, setText] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [goal, setGoal] = useState<string>("frontend_specialist");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sampleIndex, setSampleIndex] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const router = useRouter();

  const samples: string[] = [
    [
      "フロントエンドエンジニアとして3年勤務。",
      "React / Next.js / TypeScript を使った SPA / SSR 開発の経験があります。",
      "状態管理は React Query / Zustand、スタイリングは Tailwind CSS が多いです。",
      "バックエンドは Node.js（Express）や Supabase の Edge Functions を簡単に書ける程度です。",
      "CI/CD は GitHub Actions、デプロイは Vercel を利用しています。",
      "今後はよりアーキテクチャ設計やパフォーマンスチューニング、AI 連携にも強くなりたいです。"
    ].join("\n"),
    [
      "受託開発会社でフルスタックエンジニアとして4年勤務。",
      "フロントエンドは React / Vue、バックエンドは Node.js / NestJS、DB は PostgreSQL を主に使用しています。",
      "要件定義〜設計〜実装〜テスト〜リリースまで一通り経験し、小規模プロジェクトでは4〜5名のチームリードも担当しました。",
      "最近は Next.js / Prisma / Supabase を使ったモダンな SaaS 開発に興味があります。",
      "インフラは AWS（EC2 / RDS / ECS）での構築経験があり、Terraform によるIaCも簡単なものなら扱えます。"
    ].join("\n"),
    [
      "自社サービスでバックエンドエンジニアとして2年勤務。",
      "主に Node.js（Express）と Go を使った REST API / バッチ処理の開発・運用を担当しています。",
      "Redis / RabbitMQ を使った非同期処理や、New Relic / Datadog を使ったモニタリング・パフォーマンス改善も経験しました。",
      "最近はフロントエンドとの連携を意識して、API 設計や OpenAPI ベースの型共有にも取り組んでいます。",
      "今後はアーキテクチャ設計やドメインモデリングにも関わり、テックリードとしてチームを引っ張れるようになりたいです。"
    ].join("\n")
  ];

  const fillSample = () => {
    // サンプル文をローテーションで切り替える
    const next = (sampleIndex + 1) % samples.length;
    setSampleIndex(next);
    setText(samples[next] ?? "");
  };

  useEffect(() => {
    // ログインしていれば Supabase のユーザーIDを拾っておく（デモ用途）
    const supabase = getSupabaseBrowserClient();
    supabase.auth
      .getUser()
      .then(({ data }) => {
        setUserId(data.user?.id ?? null);
      })
      .catch(() => {
        setUserId(null);
      })
      .finally(() => {
        setUserLoaded(true);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!userId) {
      setError(
        "スキルマップを生成するには、右上の「ログイン」からサインアップ / ログインしてください。"
      );
      return;
    }
    if (!text.trim()) {
      setError("スキル・職務経歴を入力してください。");
      return;
    }
    setLoading(true);
    try {
      void logUsage("generate_skill_map_clicked");
      const data = await postJson<
        { text: string; repoUrl?: string; goal: string; userId?: string | null },
        { id: string }
      >("/api/generate", {
        text,
        repoUrl: repoUrl || undefined,
        goal,
        userId: userId ?? undefined
      });
      router.push(`/result/${data.id}`);
    } catch (err) {
      console.error(err);
      setError(
        "AI 解析に失敗しました。時間をおいてから、もう一度やり直してください。"
      );
    } finally {
      setLoading(false);
    }
  };

  // ログイン確認中
  if (!userLoaded) {
    return (
      <div className="text-xs text-muted-foreground">
        ログイン状態を確認しています…
      </div>
    );
  }

  // 未ログイン時はフォーム全体をロック
  if (!userId) {
    return (
      <div className="space-y-3 text-xs text-slate-700">
        <p className="font-semibold text-slate-900">ログインが必要です</p>
        <p className="leading-relaxed">
          このツールでスキルマップを生成・保存するには、右上の「ログイン」から
          サインアップ / ログインしてください。
        </p>
        <Button
          type="button"
          size="sm"
          className="mt-1"
          onClick={() => router.push("/auth/login")}
        >
          ログイン / 新規登録画面を開く
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          あなたのスキル・職務経歴
        </label>
        <p className="text-xs text-muted-foreground leading-relaxed">
          希望するポジション（例: フロントエンドエンジニア）や使っている技術、担当業務などをできるだけ具体的に書いてください。
        </p>
        <textarea
          className="mt-1 w-full min-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="例）フロントエンドエンジニアとして3年勤務。React / TypeScript / Next.js を中心にSPA開発を担当。バックエンドはNode.jsでAPIの実装経験あり。インフラはVercelとSupabaseを主に利用している。"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          目指したいキャリアの方向性
        </label>
        <select
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        >
          <option value="frontend_specialist">フロントエンド特化</option>
          <option value="fullstack">フルスタック</option>
          <option value="backend_api">バックエンド / API 中心</option>
          <option value="tech_lead">テックリード候補</option>
          <option value="unsure">まだ特に決めていない</option>
        </select>
        <p className="text-xs text-muted-foreground leading-relaxed">
          いま一番近づきたいイメージに近いものを選んでください。AI がスキルマップとロードマップを少しその方向に寄せてくれます。
        </p>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          GitHub リポジトリ URL（任意）
        </label>
        <input
          type="url"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="例）https://github.com/username/portfolio"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
        />
        <p className="text-xs text-muted-foreground leading-relaxed">
          ポートフォリオ用リポジトリなどがあれば入力すると、AI が技術スタックのヒントとして活用します（中身を直接読むわけではありません）。
        </p>
      </div>
      {error && <ErrorAlert message={error} />}
      <div className="flex flex-wrap gap-3 items-center">
        <Button type="submit" disabled={loading} className="px-6">
          {loading ? "AI が分析中..." : "AI にスキルマップを生成してもらう"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={fillSample}
          disabled={loading}
        >
          サンプル文を入れてみる
        </Button>
      </div>
    </form>
  );
}


