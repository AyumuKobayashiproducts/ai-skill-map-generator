import { NextResponse } from "next/server";
import { safeChatCompletion } from "@/lib/openaiRetry";
import { logUsageServer } from "@/lib/usageServerLogger";
import { CoachRequestSchema } from "@/types/api";
import { getRequestLocale } from "@/lib/apiLocale";
import { getApiError } from "@/lib/apiErrors";

export async function POST(request: Request) {
  try {
    const { messages, context } = CoachRequestSchema.parse(
      await request.json()
    );

    const systemContent = [
      "あなたは Web エンジニア向けの優しいキャリアコーチです。",
      "ユーザーの強み・弱み・ロードマップを踏まえて、現実的で前向きなアドバイスを日本語で返してください。",
      context?.strengths ? `強み: ${context.strengths}` : "",
      context?.weaknesses ? `弱み: ${context.weaknesses}` : "",
      context?.roadmap30 ? `30日ロードマップ: ${context.roadmap30}` : "",
      context?.roadmap90 ? `90日ロードマップ: ${context.roadmap90}` : ""
    ]
      .filter(Boolean)
      .join("\n");

    const completion = await safeChatCompletion({
      feature: "coach",
      params: {
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: systemContent },
          ...messages.map((m) => ({
            role: m.role,
            content: m.content
          }))
        ]
      }
    });

    const reply = completion.choices[0]?.message?.content ?? "";

    void logUsageServer("coach_success", {});

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Coach API error", error);
    void logUsageServer("coach_error", {
      message: error instanceof Error ? error.message : String(error)
    });
    const locale = getRequestLocale(request);
    const { code, message } = getApiError("COACH_OPENAI_ERROR", locale);
    return NextResponse.json(
      { error: message, code },
      { status: 500 }
    );
  }
}


