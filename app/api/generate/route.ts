import { NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabaseClient";
import { safeChatCompletion } from "@/lib/openaiRetry";
import { logUsageServer } from "@/lib/usageServerLogger";
import type { SkillCategories, SkillMapResult } from "@/types/skill";
import { GenerateRequestSchema, GenerateResponseSchema } from "@/types/api";
import { getRequestLocale } from "@/lib/apiLocale";
import { getApiError } from "@/lib/apiErrors";

export async function POST(request: Request) {
  try {
    const body = GenerateRequestSchema.parse(await request.json());
    const { text, repoUrl, goal, userId } = body;

    // OpenAI への日本語プロンプト
    const promptLines = [
      "あなたは Web 系エンジニア・フロントエンド/バックエンド志望者向けのキャリアコーチです。",
      "以下のユーザーのスキル・職務経歴の説明を読み、指定した JSON 形式だけを返してください。",
      "",
      "JSON のフォーマット:",
      "{",
      '  "categories": {',
      '    "frontend": number,',
      '    "backend": number,',
      '    "infra": number,',
      '    "ai": number,',
      '    "tools": number',
      "  },",
      '  "strengths": string,',
      '  "weaknesses": string,',
      '  "nextSkills": string[],',
      '  "roadmap30": string,',
      '  "roadmap90": string,',
      '  "chartData": {',
      '    "labels": string[],',
      '    "data": number[]',
      "  }",
      "}",
      "",
      "制約:",
      "- 余計な説明文は出さず、必ず有効な JSON のみを返してください。",
      "- レベルは 1〜5 の整数で出力してください。",
      "- nextSkills には、次に学ぶと良い具体的な技術名（例: TypeScript, Next.js, React Query など）を3〜7個含めてください。",
      ""
    ];

    if (repoUrl) {
      promptLines.push(
        `参考用の GitHub リポジトリ URL: ${repoUrl}`,
        "リポジトリの中身を直接読むことはできない前提ですが、URL から推測できる範囲で役割や技術スタックを考慮して構いません。",
        ""
      );
    }

    if (goal) {
      promptLines.push(
        `ユーザーの希望するキャリアゴール: ${goal}`,
        "このゴールに近づけることを意識して、カテゴリごとのレベルや nextSkills、ロードマップの内容を少し調整してください。",
        ""
      );
    }

    promptLines.push("ユーザー入力:", text);

    const prompt = promptLines.join("\n");

    // Chat Completions API を利用して JSON を生成（タイムアウト・リトライ付き）
    const completion = await safeChatCompletion({
      feature: "generate",
      params: {
        model: "gpt-4.1-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "あなたは経験豊富なキャリアコーチ兼エンジニアリングマネージャーです。"
          },
          {
            role: "user",
            content: prompt
          }
        ]
      }
    });

    const rawOutput = completion.choices[0]?.message?.content ?? "{}";
    const parsed = GenerateResponseSchema.parse(JSON.parse(rawOutput));

    const supabase = createSupabaseClient();

    const { data, error } = await supabase
      .from("skill_maps")
      .insert({
        user_id: userId ?? null,
        raw_input: text,
        categories: parsed.categories,
        strengths: parsed.strengths,
        weaknesses: parsed.weaknesses,
        roadmap_30: parsed.roadmap30,
        roadmap_90: parsed.roadmap90,
        // nextSkills も chart_data 内に含めて保存しておく
        chart_data: {
          ...parsed.chartData,
          nextSkills: parsed.nextSkills ?? []
        }
      })
      .select()
      .single();

    if (error || !data) {
      console.error("Supabase insert error", error);
      const locale = getRequestLocale(request);
      const { code, message } = getApiError("GENERATE_SAVE_FAILED", locale);
      return NextResponse.json(
        { error: message, code },
        { status: 500 }
      );
    }

    const result: SkillMapResult = {
      id: data.id,
      rawInput: data.raw_input ?? text,
      categories: parsed.categories,
      strengths: parsed.strengths,
      weaknesses: parsed.weaknesses,
      nextSkills: parsed.nextSkills ?? [],
      roadmap30: parsed.roadmap30,
      roadmap90: parsed.roadmap90,
      chartData: {
        ...parsed.chartData,
        nextSkills: parsed.nextSkills ?? []
      }
    };

    void logUsageServer("generate_skill_map_success", {
      skillMapId: data.id
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Generate API error", error);
    void logUsageServer("generate_skill_map_error", {
      message: error instanceof Error ? error.message : String(error)
    });
    const locale = getRequestLocale(request);
    const { code, message } = getApiError("GENERATE_OPENAI_ERROR", locale);
    return NextResponse.json(
      { error: message, code },
      { status: 500 }
    );
  }
}


