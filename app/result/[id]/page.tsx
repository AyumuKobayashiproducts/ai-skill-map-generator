import { notFound } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabaseClient";
import { SkillResultView } from "@/components/SkillResultView";
import type { SkillMapResult } from "@/types/skill";
import Link from "next/link";

interface ResultPageProps {
  params: {
    id: string;
  };
}

export default async function ResultPage({ params }: ResultPageProps) {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("skill_maps")
    .select("*")
    .eq("id", params.id)
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

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm animate-fade-in">
        <Link 
          href="/dashboard" 
          className="text-slate-500 hover:text-slate-700 transition-colors"
        >
          ダッシュボード
        </Link>
        <span className="text-slate-400">/</span>
        <span className="text-slate-900 font-medium">スキルマップ結果</span>
      </nav>

      <div className="animate-fade-in-up">
        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-sky-50 to-indigo-50 p-6 shadow-xl">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-sky-500 to-indigo-500 flex items-center justify-center text-white text-3xl shadow-lg shadow-emerald-500/30">
              🎉
            </div>
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">
                診断完了！
              </h2>
              <p className="text-sm md:text-base text-slate-600">
                あなたのスキルマップと転職準備プランが完成しました
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-emerald-300 text-emerald-700 text-xs font-semibold">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              スキル分析完了
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-sky-300 text-sky-700 text-xs font-semibold">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              ロードマップ生成完了
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-indigo-300 text-indigo-700 text-xs font-semibold">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              ダッシュボードに保存済み
            </div>
          </div>
        </div>
      </div>

      {/* 次の一歩ガイド */}
      <section className="animate-fade-in-up">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-2">
            <span className="text-2xl">🚀</span>
            次の一歩：このまま活用しましょう
          </h3>
          <p className="text-sm text-slate-600">
            診断結果を活用して、転職準備を具体的に進めていきましょう
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="group rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-sm hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white text-2xl mb-3 group-hover:scale-110 transition-transform shadow-md">
              📚
            </div>
            <p className="font-bold text-slate-900 text-base mb-2">
              学習ロードマップを進める
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              ロードマップの中から「今週やること」を 1 つだけ選んで着手してみましょう。取り組んだら、もう一度診断してスコアの変化を確認できます。
            </p>
          </div>
          <div className="group rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-sm hover:border-purple-300 hover:shadow-lg hover:shadow-purple-100 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl mb-3 group-hover:scale-110 transition-transform shadow-md">
              💼
            </div>
            <p className="font-bold text-slate-900 text-base mb-2">
              求人マッチングを試す
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              気になる求人票を貼り付けて、マッチ度と不足スキルを確認してみましょう。「どの求人がいまの自分に合いそうか」が見えやすくなります。
            </p>
          </div>
          <div className="group rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-sm hover:border-rose-300 hover:shadow-lg hover:shadow-rose-100 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white text-2xl mb-3 group-hover:scale-110 transition-transform shadow-md">
              🎤
            </div>
            <p className="font-bold text-slate-900 text-base mb-2">
              面接練習でアウトプットする
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              スキルマップの内容をもとに 1on1 練習で回答を作ってみましょう。STAR 法に沿ったフィードバックで、転職準備スコアの「準備」の部分を底上げできます。
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 p-6 shadow-xl">
          <p className="text-white font-semibold text-base mb-4 flex items-center gap-2">
            <span className="text-xl">🎯</span>
            よく使うアクション
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 font-semibold shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm"
            >
              <span className="text-lg">📊</span>
              ダッシュボードで履歴を見る
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm"
            >
              <span className="text-lg">✨</span>
              もう一度診断する
            </Link>
            <Link
              href="/admin/usage"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-white/30 text-white font-medium hover:bg-white/10 transition-colors text-sm"
            >
              <span className="text-lg">📈</span>
              使い方を振り返る
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-white/30 text-white font-medium hover:bg-white/10 transition-colors text-sm"
            >
              <span className="text-lg">ℹ️</span>
              アプリについて
            </Link>
          </div>
        </div>
      </section>

      <SkillResultView
        result={result}
        previousCategories={previousCategories ?? undefined}
      />
    </div>
  );
}
