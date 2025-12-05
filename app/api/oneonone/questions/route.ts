import { NextResponse } from "next/server";
import { createOpenAIClient } from "@/lib/openaiClient";
import type { OneOnOneQuestions } from "@/types/skill";
import { OneOnOneQuestionsRequestSchema } from "@/types/api";
import { loadSkillMapById } from "@/lib/skillMapLoader";

type InterviewType = "general" | "technical" | "behavioral";

const interviewTypePrompts: Record<InterviewType, { systemPrompt: string; focus: string }> = {
  general: {
    systemPrompt: "あなたは採用面接を担当する経験豊富な面接官です。候補者の適性と意欲を見極めることが得意です。",
    focus: `
【質問の観点】
- 自己紹介・経歴の要約
- 転職理由・志望動機
- キャリアプラン・将来のビジョン
- 自分の強み・弱みの認識
- チームでの役割・働き方
`
  },
  technical: {
    systemPrompt: "あなたは技術面接を担当するシニアエンジニアです。候補者の技術力と問題解決能力を見極めることが得意です。",
    focus: `
【質問の観点】
- 得意な技術スタックとその深さ
- 過去に取り組んだ技術的な課題と解決策
- 設計判断の経験（なぜその技術を選んだか）
- コードレビューやリファクタリングの経験
- 新しい技術のキャッチアップ方法
`
  },
  behavioral: {
    systemPrompt: "あなたは行動面接（コンピテンシー面接）を担当する人事担当者です。STAR法を使って候補者の行動特性を引き出すことが得意です。",
    focus: `
【質問の観点 - STAR法で深掘りできる質問】
- 困難なプロジェクトを乗り越えた経験
- チーム内での対立や意見の相違をどう解決したか
- 失敗から学んだ経験
- リーダーシップを発揮した経験
- 厳しい締め切りへの対処経験
`
  }
};

export async function POST(request: Request) {
  try {
    const { skillMapId, interviewType } = OneOnOneQuestionsRequestSchema.parse(
      await request.json()
    );

    const loaded = await loadSkillMapById(skillMapId);

    if (!loaded) {
      return NextResponse.json(
        { error: "指定されたスキルマップが見つかりませんでした。" },
        { status: 404 }
      );
    }

    const categories = loaded.categories;
    const strengths: string = loaded.strengths;
    const weaknesses: string = loaded.weaknesses;

    const openai = createOpenAIClient();
    const typeConfig = interviewTypePrompts[interviewType as InterviewType] ?? interviewTypePrompts.general;

    const prompt = [
      "転職面接の質問を作成してください。",
      "以下の候補者情報をもとに、5〜7問の面接質問を作成してください。",
      "各質問は日本語で、具体的なエピソードや成果を引き出せるような内容にしてください。",
      "",
      typeConfig.focus,
      "",
      "【候補者のスキルマップ】",
      `- 技術スコア: フロントエンド=${categories.frontend ?? 0}/5, バックエンド=${
        categories.backend ?? 0
      }/5, インフラ=${categories.infra ?? 0}/5, AI=${categories.ai ?? 0}/5, ツール=${
        categories.tools ?? 0
      }/5`,
      `- 強み: ${strengths}`,
      `- 弱み・伸びしろ: ${weaknesses}`,
      "",
      "【出力形式】",
      "以下のJSON形式で出力してください：",
      "{",
      '  "questions": ["質問1", "質問2", ...]',
      "}",
      "",
      "【制約】",
      "- 有効な JSON のみを返してください（余計な説明文は不要）",
      "- 各質問は1〜2文程度で簡潔に",
      "- 候補者のスキルセットに関連した質問を含める",
      "- 回答しやすい順（自己紹介系→経験系→深掘り系）に並べる"
    ].join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: typeConfig.systemPrompt
        },
        { role: "user", content: prompt }
      ]
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw) as OneOnOneQuestions;

    const result: OneOnOneQuestions = {
      questions: parsed.questions ?? []
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Interview questions API error", error);
    return NextResponse.json(
      { error: "面接質問の生成中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}


