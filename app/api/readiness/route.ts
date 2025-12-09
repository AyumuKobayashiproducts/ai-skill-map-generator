import { NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabaseClient";
import type { SkillCategories } from "@/types/skill";
import { ReadinessRequestSchema } from "@/types/api";
import { calculateReadinessScore } from "@/lib/readiness";
import { getRequestLocale } from "@/lib/apiLocale";
import { getApiError } from "@/lib/apiErrors";
import type { Locale } from "@/src/i18n/config";

export async function POST(request: Request) {
  try {
    const body = ReadinessRequestSchema.parse(await request.json());
    const {
      skillMapId,
      jobMatchScore,
      riskObsolescence,
      riskBusFactor,
      riskAutomation,
      prepScore: prepScoreInput,
      locale: bodyLocale
    } = body;

    const locale: Locale =
      (bodyLocale as Locale | undefined) ?? getRequestLocale(request);

    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("skill_maps")
      .select("categories")
      .eq("id", skillMapId)
      .single();

    if (error || !data) {
      const locale = getRequestLocale(request);
      const { code, message } = getApiError("READINESS_NOT_FOUND", locale);
      return NextResponse.json(
        { error: message, code },
        { status: 404 }
      );
    }

    const categories = (data.categories ?? {}) as SkillCategories;

    const result = calculateReadinessScore(
      {
        categories,
        jobMatchScore,
        riskObsolescence,
        riskBusFactor,
        riskAutomation,
        prepScore: prepScoreInput
      },
      locale
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Readiness API error", error);
    const locale = getRequestLocale(request);
    const { code, message } = getApiError("READINESS_OPENAI_ERROR", locale);
    return NextResponse.json(
      { error: message, code },
      { status: 500 }
    );
  }
}


