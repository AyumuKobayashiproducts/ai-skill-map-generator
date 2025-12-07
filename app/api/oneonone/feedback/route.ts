import { NextResponse } from "next/server";
import { safeChatCompletion } from "@/lib/openaiRetry";
import { logUsageServer } from "@/lib/usageServerLogger";
import type { OneOnOneFeedback } from "@/types/skill";
import { OneOnOneFeedbackRequestSchema } from "@/types/api";
import { evaluateAnswer, scoreToLabel } from "@/lib/answerEvaluator";
import { getRequestLocale } from "@/lib/apiLocale";
import { getApiError } from "@/lib/apiErrors";

type InterviewType = "general" | "technical" | "behavioral";

const feedbackPrompts: Record<InterviewType, { systemPrompt: string; criteria: string }> = {
  general: {
    systemPrompt: "あなたは採用面接のコーチとして、候補者の回答をレビューし、より魅力的に伝える方法をアドバイスします。候補者が自信を持って面接に臨めるよう、建設的なフィードバックを心がけてください。",
    criteria: `
【評価ポイント】
- 簡潔さ：要点を絞って伝えられているか
- 具体性：抽象的すぎず、エピソードや数字で裏付けているか
- 一貫性：志望動機とキャリアプランに整合性があるか
- 熱意：意欲や主体性が伝わるか
`
  },
  technical: {
    systemPrompt: "あなたは技術面接のコーチとして、エンジニア候補者の回答をレビューします。技術的な深さと、ビジネスインパクトの両面から評価し、より説得力のある回答を提案してください。",
    criteria: `
【評価ポイント】
- 技術的深さ：表面的でなく、仕組みやトレードオフを理解しているか
- 問題解決プロセス：どう考え、どう判断したかが伝わるか
- ビジネスインパクト：技術選定がビジネスにどう貢献したか
- 学習姿勢：新技術への対応力や成長意欲が見えるか
`
  },
  behavioral: {
    systemPrompt: "あなたは行動面接（コンピテンシー面接）のコーチです。STAR法（状況・課題・行動・結果）を使って、候補者の行動特性をより効果的にアピールする方法をアドバイスしてください。",
    criteria: `
【評価ポイント - STAR法の観点】
- Situation（状況）：どんな背景・状況だったか明確か
- Task（課題）：何を解決すべきだったか具体的か
- Action（行動）：候補者自身が何をしたか（チーム全体でなく）
- Result（結果）：どんな成果・学びがあったか数字で示せているか
`
  }
};

export async function POST(request: Request) {
  try {
    const { question, answer, strengths, weaknesses, interviewType } =
      OneOnOneFeedbackRequestSchema.parse(await request.json());

    // ルールベースの評価を先に実行
    const ruleBasedEval = evaluateAnswer(
      answer,
      (interviewType as InterviewType) ?? "general"
    );

    const typeConfig =
      feedbackPrompts[interviewType as InterviewType] ?? feedbackPrompts.general;

    // ルールベース評価の結果をプロンプトに含める
    const ruleBasedContext = [
      "【事前分析結果（ルールベース）】",
      `- 総合スコア: ${ruleBasedEval.overallScore}/100 (${scoreToLabel(ruleBasedEval.overallScore)})`,
      `- 文字数適切さ: ${ruleBasedEval.scores.length}/100`,
      `- 具体性: ${ruleBasedEval.scores.specificity}/100`,
      `- 構造: ${ruleBasedEval.scores.structure}/100`,
      `- STAR要素: ${ruleBasedEval.scores.starElements}/100`,
      ruleBasedEval.positives.length > 0
        ? `- 良い点: ${ruleBasedEval.positives.join("、")}`
        : "",
      ruleBasedEval.improvements.length > 0
        ? `- 改善点: ${ruleBasedEval.improvements.join("、")}`
        : ""
    ]
      .filter(Boolean)
      .join("\n");

    const prompt = [
      "転職面接の回答をレビューし、フィードバックと改善例を提供してください。",
      "",
      typeConfig.criteria,
      "",
      ruleBasedContext,
      "",
      "【候補者情報】",
      strengths ? `- 強み: ${strengths}` : "",
      weaknesses ? `- 伸びしろ: ${weaknesses}` : "",
      "",
      "【面接質問】",
      question,
      "",
      "【候補者の回答】",
      answer,
      "",
      "【出力形式】",
      "以下のJSON形式で出力してください：",
      "{",
      '  "feedback": "良い点と改善点を含む具体的なフィードバック（200〜300字程度）",',
      '  "improvedAnswer": "候補者の強みを活かした模範回答例（300〜400字程度）"',
      "}",
      "",
      "【フィードバックのルール】",
      "- 事前分析結果を参考にしつつ、より詳細なフィードバックを提供する",
      "- まず良い点を認め、その後に改善点を伝える（サンドイッチ法）",
      "- 「〜すると良い」など前向きな表現を使う",
      "- 模範回答は候補者の元の回答を活かしつつ、より具体的にブラッシュアップする",
      "- 数字やエピソードを追加して説得力を高める",
      "- 有効な JSON のみを返す（余計な説明文は不要）"
    ]
      .filter(Boolean)
      .join("\n");

    const completion = await safeChatCompletion({
      feature: "oneonone_feedback",
      params: {
        model: "gpt-4.1-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: typeConfig.systemPrompt
          },
          { role: "user", content: prompt }
        ]
      }
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw) as OneOnOneFeedback;

    // ルールベース評価とAI評価を組み合わせてレスポンス
    const result = {
      feedback: parsed.feedback ?? "",
      improvedAnswer: parsed.improvedAnswer ?? "",
      // ルールベース評価の結果も返す
      ruleBasedScore: ruleBasedEval.overallScore,
      ruleBasedScores: ruleBasedEval.scores
    };

    void logUsageServer("oneonone_feedback_success", {
      interviewType
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Interview feedback API error", error);
    void logUsageServer("oneonone_feedback_error", {
      message: error instanceof Error ? error.message : String(error)
    });
    const locale = getRequestLocale(request);
    const { code, message } = getApiError(
      "ONEONONE_SUMMARY_OPENAI_ERROR",
      locale
    );
    return NextResponse.json(
      { error: message, code },
      { status: 500 }
    );
  }
}


