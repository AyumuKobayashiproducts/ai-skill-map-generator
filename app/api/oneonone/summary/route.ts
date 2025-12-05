import { NextResponse } from "next/server";
import { createOpenAIClient } from "@/lib/openaiClient";
import { z } from "zod";

// セッションサマリー生成用のリクエストスキーマ
const SessionSummaryRequestSchema = z.object({
  interviewType: z.enum(["general", "technical", "behavioral"]),
  exchanges: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
      feedback: z.string()
    })
  ),
  strengths: z.string().optional(),
  weaknesses: z.string().optional()
});

type InterviewType = "general" | "technical" | "behavioral";

const interviewTypeLabels: Record<InterviewType, string> = {
  general: "一般面接",
  technical: "技術面接",
  behavioral: "行動面接（コンピテンシー面接）"
};

export async function POST(request: Request) {
  try {
    const body = SessionSummaryRequestSchema.parse(await request.json());
    const { interviewType, exchanges, strengths, weaknesses } = body;

    if (exchanges.length === 0) {
      return NextResponse.json(
        { error: "回答履歴がありません。" },
        { status: 400 }
      );
    }

    const openai = createOpenAIClient();

    const exchangesSummary = exchanges
      .map(
        (ex, i) =>
          `【質問${i + 1}】${ex.question}\n【回答】${ex.answer}\n【AI評価】${ex.feedback}`
      )
      .join("\n\n---\n\n");

    const prompt = [
      `${interviewTypeLabels[interviewType]}の練習セッションが終了しました。`,
      "以下の質疑応答履歴を総合的に分析し、セッション全体の総評を作成してください。",
      "",
      "【候補者情報】",
      strengths ? `- 強み: ${strengths}` : "",
      weaknesses ? `- 伸びしろ: ${weaknesses}` : "",
      "",
      "【質疑応答履歴】",
      exchangesSummary,
      "",
      "【出力形式】",
      "以下のJSON形式で出力してください：",
      "{",
      '  "overallScore": 1〜5の整数（5が最高評価）,',
      '  "strongPoints": ["良かった点1", "良かった点2", ...],',
      '  "improvementPoints": ["改善点1", "改善点2", ...],',
      '  "nextSteps": ["次回までにやること1", "次回までにやること2", ...],',
      '  "summary": "総評コメント（200〜300字程度）"',
      "}",
      "",
      "【評価基準】",
      "- 回答の具体性：エピソードや数字で裏付けられているか",
      "- 一貫性：キャリアストーリーに整合性があるか",
      "- 説得力：強みが効果的にアピールできているか",
      "- 改善度：個々のフィードバックを踏まえた成長が見られるか",
      "",
      "【注意】",
      "- 有効なJSONのみを返す（余計な説明文は不要）",
      "- ポジティブなトーンを心がけつつ、具体的な改善点も提示"
    ]
      .filter(Boolean)
      .join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "あなたは転職面接のコーチとして、候補者の面接練習セッションを総括し、次のステップに繋がる建設的なフィードバックを提供します。"
        },
        { role: "user", content: prompt }
      ]
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);

    const result = {
      overallScore: parsed.overallScore ?? 3,
      strongPoints: parsed.strongPoints ?? [],
      improvementPoints: parsed.improvementPoints ?? [],
      nextSteps: parsed.nextSteps ?? [],
      summary: parsed.summary ?? ""
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Session summary API error", error);
    return NextResponse.json(
      { error: "セッション総評の生成中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}



