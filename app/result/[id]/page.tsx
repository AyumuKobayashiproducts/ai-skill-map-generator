import { notFound } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabaseClient";
import { SkillResultView } from "@/components/SkillResultView";
import type { SkillMapResult } from "@/types/skill";

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

  // 比較用に直前のスキルマップを1件取得（同じユーザー前提だが、現状 user_id は未使用）
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
      <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-slate-900">
        スキルマップ結果
      </h2>
      <SkillResultView
        result={result}
        previousCategories={previousCategories ?? undefined}
      />
    </div>
  );
}


