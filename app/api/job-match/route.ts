import { NextResponse } from "next/server";
import { safeChatCompletion } from "@/lib/openaiRetry";
import { logUsageServer } from "@/lib/usageServerLogger";
import type { JobMatchResult } from "@/types/skill";
import { JobMatchRequestSchema } from "@/types/api";
import { loadSkillMapById } from "@/lib/skillMapLoader";
import { getRequestLocale } from "@/lib/apiLocale";
import { getApiError } from "@/lib/apiErrors";

export async function POST(request: Request) {
  try {
    const { skillMapId, jdText, jobUrl } = JobMatchRequestSchema.parse(
      await request.json()
    );

    const loaded = await loadSkillMapById(skillMapId);

    if (!loaded) {
      const locale = getRequestLocale(request);
      const { code, message } = getApiError("JOB_MATCH_NOT_FOUND", locale);
      return NextResponse.json(
        { error: message, code },
        { status: 404 }
      );
    }

    const categories = loaded.categories;
    const strengths: string = loaded.strengths;
    const weaknesses: string = loaded.weaknesses;
    const nextSkills: string[] =
      (loaded.chartData && (loaded.chartData as any).nextSkills) ?? [];

    const jdDescription = jdText
      ? jdText
      : `求人URL: ${jobUrl}. URL から推測できる範囲で、想定される仕事内容と求められるスキルを考慮してください。`;

    const prompt = [
      "あなたは Web エンジニアの転職支援を行うキャリアアドバイザーです。",
      "以下の情報をもとに、候補者のスキルマップと求人票のマッチング度合いを評価し、JSON だけを返してください。",
      "",
      "【候補者のスキルマップ】",
      `- カテゴリ別スコア: frontend=${categories.frontend ?? 0}, backend=${
        categories.backend ?? 0
      }, infra=${categories.infra ?? 0}, ai=${categories.ai ?? 0}, tools=${
        categories.tools ?? 0
      }`,
      `- 強み: ${strengths}`,
      `- 弱み: ${weaknesses}`,
      `- 次に学ぶと良いスキル候補: ${nextSkills.join(", ")}`,
      "",
      "【求人票】",
      jdDescription,
      "",
      "JSON フォーマット:",
      "{",
      '  "score": number,          // 0〜100のマッチングスコア（整数でOK）',
      '  "matchedSkills": string[], // 求人の中で特にマッチしているスキル・経験',
      '  "missingSkills": string[], // 不足している・弱いと考えられるスキルTOP3程度',
      '  "summary": string,         // どの点がマッチ/アンマッチかの要約（日本語）',
      '  "roadmapForJob": string    // この求人に近づくための30〜90日学習プラン（日本語）',
      "}",
      "",
      "制約:",
      "- 余計な説明文は出さず、有効な JSON のみを返してください。"
    ].join("\n");

    const completion = await safeChatCompletion({
      feature: "job_match",
      params: {
        model: "gpt-4.1-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "あなたはソフトウェアエンジニアの転職を支援するプロフェッショナルリクルーターです。"
          },
          { role: "user", content: prompt }
        ]
      }
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw) as JobMatchResult;

    // スコアは 0〜100 にクリップ
    const score = Math.max(0, Math.min(100, Math.round(parsed.score ?? 0)));

    const result: JobMatchResult = {
      score,
      matchedSkills: parsed.matchedSkills ?? [],
      missingSkills: parsed.missingSkills ?? [],
      summary: parsed.summary ?? "",
      roadmapForJob: parsed.roadmapForJob ?? ""
    };

    void logUsageServer("job_match_success", { skillMapId, hasJdText: !!jdText });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Job match API error", error);
    void logUsageServer("job_match_error", {
      message: error instanceof Error ? error.message : String(error)
    });
    const locale = getRequestLocale(request);
    const { code, message } = getApiError("JOB_MATCH_OPENAI_ERROR", locale);
    return NextResponse.json(
      { error: message, code },
      { status: 500 }
    );
  }
}


