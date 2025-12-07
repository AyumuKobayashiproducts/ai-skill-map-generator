import { NextResponse } from "next/server";
import { safeChatCompletion } from "@/lib/openaiRetry";
import { logUsageServer } from "@/lib/usageServerLogger";
import type { TimeSimulationResult } from "@/types/skill";
import { TimeSimulateRequestSchema } from "@/types/api";
import { loadSkillMapById } from "@/lib/skillMapLoader";
import { getRequestLocale } from "@/lib/apiLocale";
import { getApiError } from "@/lib/apiErrors";

export async function POST(request: Request) {
  try {
    const { skillMapId, weekdayHours, weekendHours, months } =
      TimeSimulateRequestSchema.parse(await request.json());

    const loaded = await loadSkillMapById(skillMapId);

    if (!loaded) {
      const locale = getRequestLocale(request);
      const { code, message } = getApiError("TIME_SIM_NOT_FOUND", locale);
      return NextResponse.json(
        { error: message, code },
        { status: 404 }
      );
    }

    const roadmap30: string = loaded.roadmap30;
    const roadmap90: string = loaded.roadmap90;

    const prompt = [
      "あなたはソフトウェアエンジニアの学習計画を立てるコーチです。",
      "以下の元々の30/90日ロードマップと、学習に使える時間の条件を踏まえて、",
      "1) 現実的なプラン",
      "2) 少しストイックな理想プラン",
      "を日本語で提案してください。",
      "",
      `平日あたりの学習時間: ${weekdayHours}時間`,
      `休日あたりの学習時間: ${weekendHours}時間`,
      `計画期間: 約 ${months} ヶ月`,
      "",
      "【元の30日ロードマップ】",
      roadmap30,
      "",
      "【元の90日ロードマップ】",
      roadmap90,
      "",
      "JSON フォーマット:",
      "{",
      '  "realisticPlan": string,',
      '  "idealPlan": string,',
      '  "notes": string',
      "}",
      "",
      "制約:",
      "- 余計な説明文は出さず、有効な JSON のみを返してください。",
      "- 日/週単位でタスクをまとめ、現実的な優先順位付けをしてください。"
    ].join("\n");

    const completion = await safeChatCompletion({
      feature: "time_simulate",
      params: {
        model: "gpt-4.1-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "あなたは現実的な学習計画を立てることが得意なメンターです。"
          },
          { role: "user", content: prompt }
        ]
      }
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw) as TimeSimulationResult;

    const result: TimeSimulationResult = {
      realisticPlan: parsed.realisticPlan ?? "",
      idealPlan: parsed.idealPlan ?? "",
      notes: parsed.notes ?? ""
    };

    void logUsageServer("time_simulate_success", { skillMapId });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Time simulate API error", error);
    void logUsageServer("time_simulate_error", {
      message: error instanceof Error ? error.message : String(error)
    });
    const locale = getRequestLocale(request);
    const { code, message } = getApiError("TIME_SIM_OPENAI_ERROR", locale);
    return NextResponse.json(
      { error: message, code },
      { status: 500 }
    );
  }
}


