"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ui/error-alert";
import { postJson, isApiClientError } from "@/lib/apiClient";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowserClient";
import { logUsage } from "@/lib/usageLogger";
import type { Locale } from "@/src/i18n/config";

const goalOptions = [
  { value: "frontend_specialist", emoji: "🎨" },
  { value: "fullstack", emoji: "🌐" },
  { value: "backend_api", emoji: "⚙️" },
  { value: "tech_lead", emoji: "👑" },
  { value: "unsure", emoji: "🤔" }
] as const;

// サンプル職務経歴（next-intl は配列をサポートしないためコンポーネント内でロケール別に定義）
const SAMPLE_TEXTS_BY_LOCALE: Record<Locale, string[]> = {
  ja: [
    `フロントエンドエンジニアとして3年勤務。
React / Next.js / TypeScript を使った SPA / SSR 開発の経験があります。
状態管理は React Query / Zustand、スタイリングは Tailwind CSS が多いです。
バックエンドは Node.js（Express）や Supabase の Edge Functions を簡単に書ける程度です。
CI/CD は GitHub Actions、デプロイは Vercel を利用しています。
今後はよりアーキテクチャ設計やパフォーマンスチューニング、AI 連携にも強くなりたいです。`,
    `受託開発会社でフルスタックエンジニアとして4年勤務。
フロントエンドは React / Vue、バックエンドは Node.js / NestJS、DB は PostgreSQL を主に使用しています。
要件定義〜設計〜実装〜テスト〜リリースまで一通り経験し、小規模プロジェクトでは4〜5名のチームリードも担当しました。
最近は Next.js / Prisma / Supabase を使ったモダンな SaaS 開発に興味があります。
インフラは AWS（EC2 / RDS / ECS）での構築経験があり、Terraform によるIaCも簡単なものなら扱えます。`,
    `自社サービスでバックエンドエンジニアとして2年勤務。
主に Node.js（Express）と Go を使った REST API / バッチ処理の開発・運用を担当しています。
Redis / RabbitMQ を使った非同期処理や、New Relic / Datadog を使ったモニタリング・パフォーマンス改善も経験しました。
最近はフロントエンドとの連携を意識して、API 設計や OpenAPI ベースの型共有にも取り組んでいます。
今後はアーキテクチャ設計やドメインモデリングにも関わり、テックリードとしてチームを引っ張れるようになりたいです。`
  ],
  en: [
    `Worked as a frontend engineer for about 3 years.
Mainly building SPAs / SSR apps with React, Next.js and TypeScript.
For state management I often use React Query / Zustand, and Tailwind CSS for styling.
On the backend side I can write simple APIs with Node.js (Express) and Supabase Edge Functions.
CI/CD is set up with GitHub Actions and deployments are done via Vercel.
I’d like to deepen my skills in architecture design, performance tuning and AI integration going forward.`,
    `Worked as a full‑stack engineer for 4 years at a contract development company.
Frontend experience with React / Vue, backend with Node.js / NestJS, mainly using PostgreSQL as the database.
Have been involved end‑to‑end from requirements / design through implementation, testing and release, and led 4–5 person teams on small projects.
Recently I’m interested in building modern SaaS products using Next.js / Prisma / Supabase.
I also have experience with AWS (EC2 / RDS / ECS) infrastructure and light Terraform‑based IaC.`,
    `Worked as a backend engineer for 2 years on an in‑house product.
Mainly responsible for REST APIs and batch jobs using Node.js (Express) and Go.
Have experience with asynchronous processing using Redis / RabbitMQ and with monitoring & performance tuning using New Relic / Datadog.
Recently I’ve been focusing on better API design and OpenAPI‑based type sharing with the frontend.
In the future I’d like to be involved in architecture design and domain modeling and eventually grow into a tech lead role.`
  ]
};

export function SkillForm() {
  const t = useTranslations("skillForm");
  const locale = useLocale() as Locale;
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
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "screenshot";

  const samples = SAMPLE_TEXTS_BY_LOCALE[locale] ?? SAMPLE_TEXTS_BY_LOCALE.ja;

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

    if (!userId && !isDemo) {
      setError(t("errors.loginRequired"));
      return;
    }
    if (!text.trim()) {
      setError(t("errors.textRequired"));
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
        {
          text: string;
          repoUrl?: string;
          goal: string;
          userId?: string | null;
          locale?: Locale;
        },
        { id: string }
      >("/api/generate", {
        text,
        repoUrl: repoUrl || undefined,
        goal,
        userId: userId ?? undefined,
        locale
      });
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      router.push(`/${locale}/result/${data.id}`);
    } catch (err: unknown) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      console.error(err);
      if (isApiClientError(err)) {
        if (err.code === "GENERATE_SAVE_FAILED") {
          setError(t("errors.aiFailedSave"));
        } else if (err.code === "GENERATE_OPENAI_ERROR") {
          setError(t("errors.aiFailedOpenAI"));
        } else {
          setError(err.message || t("errors.aiFailed"));
        }
      } else {
        setError(t("errors.aiFailed"));
      }
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
        {t("loading.checkingLogin")}
      </div>
    );
  }

  // 未ログイン時はフォーム全体をロック
  if (!userId && !isDemo) {
    return (
      <div className="space-y-4 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-sky-50 border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white text-lg">
            🔐
          </div>
          <div>
            <p className="font-semibold text-slate-900">
              {t("locked.title")}
            </p>
            <p className="text-xs text-slate-600">
              {t("locked.body")}
            </p>
          </div>
        </div>
        <Button
          type="button"
          onClick={() => router.push("/auth/login")}
          className="w-full"
        >
          {t("locked.button")}
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
          {t("skillInput.label")}
        </label>
        <p className="text-xs text-slate-600 leading-relaxed">
          {t("skillInput.description")}
        </p>
        <div className="relative">
          <textarea
            id="skill-input"
            className="w-full min-h-[180px] rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition-all duration-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 focus:outline-none resize-none"
            placeholder={t("skillInput.placeholder")}
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
            {t("skillInput.countLabel", { count: text.length })}
          </div>
        </div>
        <p id="skill-input-hint" className="sr-only">
          {t("skillInput.hint")}
        </p>
        <button
          type="button"
          onClick={fillSample}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-700 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 rounded px-2 py-1"
          aria-label={t("skillInput.sampleAria")}
        >
          <span aria-hidden="true">💡</span>
          {t("skillInput.sampleButton")}
        </button>
      </div>

      {/* キャリアゴール選択 */}
      <div className="space-y-3">
        <fieldset>
          <legend className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-3">
            <span className="text-base" aria-hidden="true">🎯</span>
            {t("goal.legend")}
          </legend>
          <div
            className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3"
            role="radiogroup"
            aria-label={t("goal.aria")}
          >
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
                      {t(`goal.options.${option.value}.label`)}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {t(`goal.options.${option.value}.desc`)}
                    </p>
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
            {t("goal.helper")}
          </p>
        </fieldset>
      </div>

      {/* GitHub URL */}
      <div className="space-y-2">
        <label htmlFor="repo-url" className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <span className="text-base" aria-hidden="true">🔗</span>
          {t("repo.label")}
          <span className="text-xs font-normal text-slate-500">
            {t("repo.optional")}
          </span>
        </label>
        <input
          id="repo-url"
          type="url"
          className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition-all duration-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 focus:outline-none"
          placeholder={t("repo.placeholder")}
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          aria-describedby="repo-url-hint"
        />
        <p id="repo-url-hint" className="text-xs text-slate-500 leading-relaxed">
          {t("repo.hint")}
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
              <p className="text-sm font-bold text-slate-900">
                {t("loading.title")}
              </p>
              <p className="text-xs text-slate-600">
                {t("loading.eta")}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {[0, 1, 2].map((step) => {
              const iconMap = ["📝", "🔍", "🗺️"] as const;
              const icon = iconMap[step] ?? "✨";
              const label = t(`loading.step${step}` as "loading.step0" | "loading.step1" | "loading.step2");
              return (
                <div
                  key={step}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-500 ${
                    loadingStep >= step
                      ? "bg-white border-2 border-sky-300 shadow-sm"
                      : "bg-white/50 border border-slate-200"
                  }`}
                >
                  <span
                    className={`text-lg transition-transform duration-300 ${
                      loadingStep >= step ? "scale-110" : ""
                    }`}
                  >
                    {icon}
                  </span>
                  <span
                    className={`text-xs font-medium transition-colors ${
                      loadingStep >= step ? "text-sky-700" : "text-slate-500"
                    }`}
                  >
                    {label}
                  </span>
                  {loadingStep >= step && (
                    <svg
                      className="w-4 h-4 text-emerald-500 ml-auto"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 送信ボタン */}
      <Button type="submit" disabled={loading} className="w-full" size="lg">
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {t("loading.button", { step: loadingStep + 1 })}
          </>
        ) : (
          <>
            <span>✨</span>
            {t("submit.label")}
          </>
        )}
      </Button>
    </form>
  );
}
