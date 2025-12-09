import { NextResponse } from "next/server";
import { safeChatCompletion } from "@/lib/openaiRetry";
import { logUsageServer } from "@/lib/usageServerLogger";
import type { SkillCategories } from "@/types/skill";
import { StoryRequestSchema } from "@/types/api";
import { getRequestLocale } from "@/lib/apiLocale";
import { getApiError } from "@/lib/apiErrors";
import type { Locale } from "@/src/i18n/config";

export async function POST(request: Request) {
  try {
    const body = StoryRequestSchema.parse(await request.json());
    const strengths: string | undefined = body.strengths;
    const weaknesses: string | undefined = body.weaknesses;
    const categories: SkillCategories | undefined = body.categories;
    const locale: Locale =
      (body.locale as Locale | undefined) ?? getRequestLocale(request);

    const promptLines: string[] =
      locale === "en"
        ? [
            "Based on the following information, write a short profile story that describes the user's career and skills in natural English.",
            "・Length: around 3–5 sentences.",
            "・Tone: positive, specific and easy to understand for hiring managers.",
            strengths ? `Strengths: ${strengths}` : "",
            weaknesses ? `Areas to improve: ${weaknesses}` : "",
            categories
              ? `Category scores: frontend=${categories.frontend ?? 0}, backend=${categories.backend ?? 0}, infra=${categories.infra ?? 0}, ai=${categories.ai ?? 0}, tools=${categories.tools ?? 0}`
              : "",
            "",
            "Output only the story text."
          ]
        : [
            "以下の情報から、ユーザーのキャリアやスキル感を表す短いプロフィールストーリーを日本語で作成してください。",
            "・文章量は 3〜5 文程度で、ポジティブで読みやすいトーンにしてください。",
            strengths ? `強み: ${strengths}` : "",
            weaknesses ? `弱み: ${weaknesses}` : "",
            categories
              ? `カテゴリ別スコア: frontend=${categories.frontend ?? 0}, backend=${categories.backend ?? 0}, infra=${categories.infra ?? 0}, ai=${categories.ai ?? 0}, tools=${categories.tools ?? 0}`
              : "",
            "",
            "ストーリーだけを出力してください。"
          ];

    const prompt = promptLines.filter(Boolean).join("\n");

    const completion = await safeChatCompletion({
      feature: "story",
      params: {
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content:
              locale === "en"
                ? "You are a resume coach who helps candidates present their strengths clearly in English."
                : "あなたは候補者の魅力を引き出す職務経歴書コーチです。"
          },
          { role: "user", content: prompt }
        ]
      }
    });

    const story = completion.choices[0]?.message?.content ?? "";

    void logUsageServer("story_success", {});

    return NextResponse.json({ story });
  } catch (error) {
    console.error("Story API error", error);
    void logUsageServer("story_error", {
      message: error instanceof Error ? error.message : String(error)
    });
    const locale = getRequestLocale(request);
    const { code, message } = getApiError("STORY_OPENAI_ERROR", locale);
    return NextResponse.json(
      { error: message, code },
      { status: 500 }
    );
  }
}


