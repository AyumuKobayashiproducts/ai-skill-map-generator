import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createSupabaseClient } from "@/lib/supabaseClient";
import { SkillResultView } from "@/components/SkillResultView";
import type { SkillMapResult } from "@/types/skill";
import Link from "next/link";
import { DemoGuideBanner } from "@/components/DemoGuideBanner";

export const dynamic = "force-dynamic";

interface ResultPageProps {
  params: {
    locale: string;
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function LocaleResultPage({ params, searchParams }: ResultPageProps) {
  const { locale, id } = params;
  const t = await getTranslations("result");
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("skill_maps")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return notFound();
  }

  const result: SkillMapResult = {
    id: data.id,
    rawInput: data.raw_input ?? "",
    categories: data.categories ?? {},
    strengths: data.strengths ?? "",
    weaknesses: data.weaknesses ?? "",
    nextSkills:
      (data.chart_data && (data.chart_data as any).nextSkills) ?? undefined,
    roadmap30: data.roadmap_30 ?? "",
    roadmap90: data.roadmap_90 ?? "",
    chartData: data.chart_data ?? null
  };

  // 比較用に直前のスキルマップを1件取得
  const { data: prev, error: prevError } = await supabase
    .from("skill_maps")
    .select("id, categories, created_at")
    .lt("created_at", data.created_at)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const previousCategories = !prevError && prev ? (prev.categories as any) : null;
  const isDemo = searchParams?.demo === "4";

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm animate-fade-in">
        <Link 
          href={`/${locale}/dashboard`} 
          className="text-slate-500 hover:text-slate-700 transition-colors"
        >
          {t("breadcrumb.dashboard")}
        </Link>
        <span className="text-slate-400">/</span>
        <span className="text-slate-900 font-medium">
          {t("breadcrumb.result")}
        </span>
      </nav>

      <div className="animate-fade-in-up">
        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-sky-50 to-indigo-50 p-6 shadow-xl">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-sky-500 to-indigo-500 flex items-center justify-center text-white text-3xl shadow-lg shadow-emerald-500/30">
              🎉
            </div>
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">
                {t("hero.title")}
              </h2>
              <p className="text-sm md:text-base text-slate-600">
                {t("hero.subtitle")}
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-emerald-300 text-emerald-700 text-xs font-semibold">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {t("hero.badges.analysisDone")}
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-sky-300 text-sky-700 text-xs font-semibold">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {t("hero.badges.roadmapDone")}
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-indigo-300 text-indigo-700 text-xs font-semibold">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {t("hero.badges.savedToDashboard")}
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-slate-300 text-slate-800 text-xs font-semibold">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m0 0l-4-4m4 4l4-4"
                />
              </svg>
              <Link
                href={`/api/export/${result.id}`}
                prefetch={false}
                className="underline-offset-2 hover:underline"
              >
                {t("hero.badges.downloadMarkdown")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 次の一歩ガイド */}
      <section className="animate-fade-in-up">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-2">
            <span className="text-2xl">🚀</span>
            {t("nextSteps.title")}
          </h3>
          <p className="text-sm text-slate-600">
            {t("nextSteps.description")}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="group rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-sm hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white text-2xl mb-3 group-hover:scale-110 transition-transform shadow-md">
              📚
            </div>
            <p className="font-bold text-slate-900 text-base mb-2">
              {t("nextSteps.cards.learning.title")}
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t("nextSteps.cards.learning.body")}
            </p>
          </div>
          <div className="group rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-sm hover:border-purple-300 hover:shadow-lg hover:shadow-purple-100 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl mb-3 group-hover:scale-110 transition-transform shadow-md">
              💼
            </div>
            <p className="font-bold text-slate-900 text-base mb-2">
              {t("nextSteps.cards.jobs.title")}
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t("nextSteps.cards.jobs.body")}
            </p>
          </div>
          <div className="group rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-sm hover:border-rose-300 hover:shadow-lg hover:shadow-rose-100 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white text-2xl mb-3 group-hover:scale-110 transition-transform shadow-md">
              🎤
            </div>
            <p className="font-bold text-slate-900 text-base mb-2">
              {t("nextSteps.cards.interview.title")}
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t("nextSteps.cards.interview.body")}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 p-6 shadow-xl">
          <p className="text-white font-semibold text-base mb-4 flex items-center gap-2">
            <span className="text-xl">🎯</span>
            {t("nextSteps.quickActions.title")}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${locale}/dashboard`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 font-semibold shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm"
            >
              <span className="text-lg">📊</span>
              {t("nextSteps.quickActions.toDashboard")}
            </Link>
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm"
            >
              <span className="text-lg">✨</span>
              {t("nextSteps.quickActions.again")}
            </Link>
            <Link
              href={`/${locale}/admin/usage`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-white/30 text-white font-medium hover:bg-white/10 transition-colors text-sm"
            >
              <span className="text-lg">📈</span>
              {t("nextSteps.quickActions.usage")}
            </Link>
            <Link
              href={`/${locale}/about`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-white/30 text-white font-medium hover:bg-white/10 transition-colors text-sm"
            >
              <span className="text-lg">ℹ️</span>
              {t("nextSteps.quickActions.about")}
            </Link>
          </div>
        </div>
      </section>

      <SkillResultView
        result={result}
        previousCategories={previousCategories ?? undefined}
      />
      {isDemo && (
        <DemoGuideBanner
          step={2}
          title={t("demoGuide.title")}
          description={t("demoGuide.description")}
        />
      )}
    </div>
  );
}
