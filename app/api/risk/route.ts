import { NextResponse } from "next/server";
import { safeChatCompletion } from "@/lib/openaiRetry";
import { logUsageServer } from "@/lib/usageServerLogger";
import type { CareerRiskResult } from "@/types/skill";
import { RiskRequestSchema } from "@/types/api";
import { loadSkillMapById } from "@/lib/skillMapLoader";
import { getRequestLocale } from "@/lib/apiLocale";
import { getApiError } from "@/lib/apiErrors";

export async function POST(request: Request) {
  try {
    const { skillMapId } = RiskRequestSchema.parse(await request.json());

    const loaded = await loadSkillMapById(skillMapId);

    if (!loaded) {
      const locale = getRequestLocale(request);
      const { code, message } = getApiError("RISK_NOT_FOUND", locale);
      return NextResponse.json(
        { error: message, code },
        { status: 404 }
      );
    }

    const categories = loaded.categories;
    const strengths: string = loaded.strengths;
    const weaknesses: string = loaded.weaknesses;

    const prompt = [
      "あなたはソフトウェアエンジニアのキャリアリスクを分析するアナリストです。",
      "以下の情報から、3つのリスクを 0〜100 でスコアリングし、JSON だけを返してください。",
      "",
      "リスクの定義:",
      "- obsolescence: 特定技術への依存度が高く、今後陳腐化したときに困るリスク",
      "- busFactor: 特定領域に知識が偏り、チームや組織がその人に強く依存しているリスク",
      "- automation: 仕事の多くが自動化/AI に置き換えられそうなリスク",
      "",
      "【候補者のスキルマップ】",
      `- カテゴリ別スコア: frontend=${categories.frontend ?? 0}, backend=${
        categories.backend ?? 0
      }, infra=${categories.infra ?? 0}, ai=${categories.ai ?? 0}, tools=${
        categories.tools ?? 0
      }`,
      `- 強み: ${strengths}`,
      `- 弱み: ${weaknesses}`,
      "",
      "JSON フォーマット:",
      "{",
      '  "obsolescence": number, // 0〜100の整数。高いほどリスク大。',
      '  "busFactor": number,',
      '  "automation": number,',
      '  "summary": string, // 主要なリスクの要約（日本語）',
      '  "actions": string  // リスクを下げるための具体的なアクション案（日本語）',
      "}",
      "",
      "制約:",
      "- 余計な説明文は出さず、有効な JSON のみを返してください。"
    ].join("\n");

    const completion = await safeChatCompletion({
      feature: "risk",
      params: {
        model: "gpt-4.1-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "あなたは、エンジニアの市場価値とキャリアリスクを定量化するアナリストです。"
          },
          { role: "user", content: prompt }
        ]
      }
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw) as CareerRiskResult;

    const clamp = (n: number | undefined) =>
      Math.max(0, Math.min(100, Math.round(n ?? 0)));

    const result: CareerRiskResult = {
      obsolescence: clamp(parsed.obsolescence),
      busFactor: clamp(parsed.busFactor),
      automation: clamp(parsed.automation),
      summary: parsed.summary ?? "",
      actions: parsed.actions ?? ""
    };

    void logUsageServer("risk_success", { skillMapId });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Risk API error", error);
    void logUsageServer("risk_error", {
      message: error instanceof Error ? error.message : String(error)
    });
    const locale = getRequestLocale(request);
    const { code, message } = getApiError("RISK_OPENAI_ERROR", locale);
    return NextResponse.json(
      { error: message, code },
      { status: 500 }
    );
  }
}


