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
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 via-indigo-500 to-emerald-400 flex items-center justify-center text-white text-2xl shadow-lg shadow-sky-500/25">
            🗺️
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              スキルマップ結果
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              あなたのスキルを AI が分析しました
            </p>
          </div>
        </div>
      </div>

      {/* 次の一歩ガイド */}
      <section className="animate-fade-in-up">
        <div className="grid gap-3 md:grid-cols-3 text-xs md:text-sm">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="font-semibold text-slate-900 flex items-center gap-2 mb-1.5">
              <span>📚</span>
              学習ロードマップを進める
            </p>
            <p className="text-slate-600 leading-relaxed">
              ロードマップの中から「今週やること」を 1 つだけ選んで着手してみましょう。取り組んだら、もう一度診断してスコアの変化を確認できます。
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="font-semibold text-slate-900 flex items-center gap-2 mb-1.5">
              <span>💼</span>
              求人マッチングを試す
            </p>
            <p className="text-slate-600 leading-relaxed">
              気になる求人票を貼り付けて、マッチ度と不足スキルを確認してみましょう。「どの求人がいまの自分に合いそうか」が見えやすくなります。
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="font-semibold text-slate-900 flex items-center gap-2 mb-1.5">
              <span>🎤</span>
              面接練習でアウトプットする
            </p>
            <p className="text-slate-600 leading-relaxed">
              スキルマップの内容をもとに 1on1 練習で回答を作ってみましょう。STAR 法に沿ったフィードバックで、転職準備スコアの「準備」の部分を底上げできます。
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-xs md:text-sm">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 text-white font-medium shadow-sm hover:bg-sky-700 transition-colors"
          >
            📊 ダッシュボードで履歴を見る
          </Link>
          <Link
            href="/admin/usage"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white font-medium shadow-sm hover:bg-slate-800 transition-colors"
          >
            📈 自分の使い方を振り返る
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
          >
            ℹ️ アプリの背景を読む
          </Link>
        </div>
      </section>

      <SkillResultView
        result={result}
        previousCategories={previousCategories ?? undefined}
      />
    </div>
  );
}
