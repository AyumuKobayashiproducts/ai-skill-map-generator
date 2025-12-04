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

      <SkillResultView
        result={result}
        previousCategories={previousCategories ?? undefined}
      />
    </div>
  );
}
