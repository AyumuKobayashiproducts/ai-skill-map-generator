"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ui/error-alert";
import { postJson } from "@/lib/apiClient";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowserClient";
import { logUsage } from "@/lib/usageLogger";

const goalOptions = [
  { value: "frontend_specialist", label: "フロントエンド特化", emoji: "🎨", desc: "UI/UXに集中" },
  { value: "fullstack", label: "フルスタック", emoji: "🌐", desc: "幅広く対応" },
  { value: "backend_api", label: "バックエンド / API 中心", emoji: "⚙️", desc: "ロジック重視" },
  { value: "tech_lead", label: "テックリード候補", emoji: "👑", desc: "リーダーシップ" },
  { value: "unsure", label: "まだ特に決めていない", emoji: "🤔", desc: "探索中" }
];

export function SkillForm() {
  const [text, setText] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [goal, setGoal] = useState<string>("frontend_specialist");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
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
    const next = (sampleIndex + 1) % samples.length;
    setSampleIndex(next);
    setText(samples[next] ?? "");
  };

  useEffect(() => {
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
    setLoadingStep(0);

    // 進行状況アニメーション（視覚的フィードバック）
    const stepTimer1 = setTimeout(() => setLoadingStep(1), 3000);
    const stepTimer2 = setTimeout(() => setLoadingStep(2), 8000);

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
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      router.push(`/result/${data.id}`);
    } catch (err) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      console.error(err);
      setError(
        "AI 解析に失敗しました。OpenAI API キーの設定を確認するか、時間をおいてから、もう一度やり直してください。"
      );
    } finally {
      setLoading(false);
      setLoadingStep(0);
    }
  };

  // ログイン確認中
  if (!userLoaded) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <div className="w-4 h-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
        ログイン状態を確認しています…
      </div>
    );
  }

  // 未ログイン時はフォーム全体をロック
  if (!userId) {
    return (
      <div className="space-y-4 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-sky-50 border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white text-lg">
            🔐
          </div>
          <div>
            <p className="font-semibold text-slate-900">ログインが必要です</p>
            <p className="text-xs text-slate-600">
              スキルマップを生成・保存するにはログインしてください
            </p>
          </div>
        </div>
        <Button
          type="button"
          onClick={() => router.push("/auth/login")}
          className="w-full"
        >
          ログイン / 新規登録画面を開く
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* スキル入力 */}
      <div className="space-y-2">
        <label htmlFor="skill-input" className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <span className="text-base" aria-hidden="true">✍️</span>
          あなたのスキル・職務経歴
        </label>
        <p className="text-xs text-slate-600 leading-relaxed">
          希望するポジション（例: フロントエンドエンジニア）や使っている技術、担当業務などをできるだけ具体的に書いてください。
        </p>
        <div className="relative">
          <textarea
            id="skill-input"
            className="w-full min-h-[180px] rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition-all duration-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 focus:outline-none resize-none"
            placeholder="例）フロントエンドエンジニアとして3年勤務。React / TypeScript / Next.js を中心にSPA開発を担当。バックエンドはNode.jsでAPIの実装経験あり。インフラはVercelとSupabaseを主に利用している。"
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-describedby="skill-input-hint skill-input-count"
            aria-required="true"
          />
          <div 
            id="skill-input-count" 
            className="absolute bottom-3 right-3 text-xs text-slate-400"
            aria-live="polite"
          >
            {text.length} 文字
          </div>
        </div>
        <p id="skill-input-hint" className="sr-only">
          あなたの職務経歴やスキルセットをできるだけ具体的に入力してください。サンプル文ボタンで例文を挿入できます。
        </p>
        <button
          type="button"
          onClick={fillSample}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-700 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 rounded px-2 py-1"
          aria-label="サンプル文を入力欄に挿入する"
        >
          <span aria-hidden="true">💡</span>
          サンプル文を入れてみる
        </button>
      </div>

      {/* キャリアゴール選択 */}
      <div className="space-y-3">
        <fieldset>
          <legend className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-3">
            <span className="text-base" aria-hidden="true">🎯</span>
            目指したいキャリアの方向性
          </legend>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3" role="radiogroup" aria-label="キャリアの方向性">
            {goalOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={goal === option.value}
                onClick={() => setGoal(option.value)}
                className={`group relative p-3 rounded-xl border-2 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 ${
                  goal === option.value
                    ? "border-sky-400 bg-sky-50 shadow-md shadow-sky-100"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-lg transition-transform duration-200 ${goal === option.value ? "scale-110" : "group-hover:scale-105"}`} aria-hidden="true">
                    {option.emoji}
                  </span>
                  <div>
                    <p className={`text-sm font-medium ${goal === option.value ? "text-sky-700" : "text-slate-900"}`}>
                      {option.label}
                    </p>
                    <p className="text-[10px] text-slate-500">{option.desc}</p>
                  </div>
                </div>
                {goal === option.value && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-sky-500 flex items-center justify-center" aria-hidden="true">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mt-3">
            いま一番近づきたいイメージに近いものを選んでください。AI がスキルマップとロードマップを少しその方向に寄せてくれます。
          </p>
        </fieldset>
      </div>

      {/* GitHub URL */}
      <div className="space-y-2">
        <label htmlFor="repo-url" className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <span className="text-base" aria-hidden="true">🔗</span>
          GitHub リポジトリ URL
          <span className="text-xs font-normal text-slate-500">（任意）</span>
        </label>
        <input
          id="repo-url"
          type="url"
          className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition-all duration-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 focus:outline-none"
          placeholder="例）https://github.com/username/portfolio"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          aria-describedby="repo-url-hint"
        />
        <p id="repo-url-hint" className="text-xs text-slate-500 leading-relaxed">
          ポートフォリオ用リポジトリなどがあれば入力すると、AI が技術スタックのヒントとして活用します。
        </p>
      </div>

      {error && <ErrorAlert message={error} />}

      {/* ローディング進行状況 */}
      {loading && (
        <div className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-sky-50 to-indigo-50 border-2 border-sky-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">AI が診断中...</p>
              <p className="text-xs text-slate-600">予想時間: 約 30〜60秒</p>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { step: 0, label: "職務経歴を要約中", icon: "📝" },
              { step: 1, label: "スキルを分類中", icon: "🔍" },
              { step: 2, label: "ロードマップを生成中", icon: "🗺️" }
            ].map((item) => (
              <div
                key={item.step}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-500 ${
                  loadingStep >= item.step
                    ? "bg-white border-2 border-sky-300 shadow-sm"
                    : "bg-white/50 border border-slate-200"
                }`}
              >
                <span className={`text-lg transition-transform duration-300 ${loadingStep >= item.step ? "scale-110" : ""}`}>
                  {item.icon}
                </span>
                <span className={`text-xs font-medium transition-colors ${loadingStep >= item.step ? "text-sky-700" : "text-slate-500"}`}>
                  {item.label}
                </span>
                {loadingStep >= item.step && (
                  <svg className="w-4 h-4 text-emerald-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 送信ボタン */}
      <Button type="submit" disabled={loading} className="w-full" size="lg">
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            AI が分析中...（{loadingStep + 1}/3）
          </>
        ) : (
          <>
            <span>✨</span>
            AI にスキルマップを生成してもらう
          </>
        )}
      </Button>
    </form>
  );
}
