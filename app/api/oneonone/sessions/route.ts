import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabaseClient";
import { z } from "zod";

// セッション保存用のリクエストスキーマ
const SaveSessionRequestSchema = z.object({
  skillMapId: z.string().uuid(),
  interviewType: z.enum(["general", "technical", "behavioral"]),
  questionCount: z.number().int().min(1),
  overallScore: z.number().int().min(1).max(5).optional(),
  strongPoints: z.array(z.string()).optional(),
  improvementPoints: z.array(z.string()).optional(),
  nextSteps: z.array(z.string()).optional(),
  summary: z.string().optional(),
  exchanges: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
        feedback: z.string()
      })
    )
    .optional()
});

// セッション履歴を取得（GET）
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const skillMapId = searchParams.get("skillMapId");
    const limit = parseInt(searchParams.get("limit") ?? "10", 10);

    const supabase = createSupabaseServiceClient();

    let query = supabase
      .from("interview_sessions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (skillMapId) {
      query = query.eq("skill_map_id", skillMapId);
    }

    const { data, error } = await query;

    if (error) {
      // テーブルが存在しない場合（42P01）やRLS権限がない場合は空配列を返す
      // ポートフォリオ用途なので、エラー時でもUIが壊れないようにする
      console.warn("Failed to fetch interview sessions (returning empty):", error.code, error.message);
      return NextResponse.json({ sessions: [] });
    }

    return NextResponse.json({ sessions: data ?? [] });
  } catch (error) {
    // 例外が発生した場合も空配列を返す
    console.warn("Interview sessions GET error (returning empty):", error);
    return NextResponse.json({ sessions: [] });
  }
}

// セッションを保存（POST）
export async function POST(request: Request) {
  try {
    const body = SaveSessionRequestSchema.parse(await request.json());

    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
      .from("interview_sessions")
      .insert({
        skill_map_id: body.skillMapId,
        interview_type: body.interviewType,
        question_count: body.questionCount,
        overall_score: body.overallScore,
        strong_points: body.strongPoints,
        improvement_points: body.improvementPoints,
        next_steps: body.nextSteps,
        summary: body.summary,
        exchanges: body.exchanges
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to save interview session:", error.code, error.message);
      // テーブルが存在しない場合でも、ユーザーには保存できなかったことを伝える
      return NextResponse.json(
        { 
          error: "セッションの保存に失敗しました。しばらく時間をおいて再度お試しください。",
          code: "ONEONONE_SESSIONS_SAVE_FAILED"
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ session: data });
  } catch (error) {
    console.error("Interview sessions POST error:", error);
    return NextResponse.json(
      { 
        error: "セッションの保存に失敗しました。",
        code: "ONEONONE_SESSIONS_SAVE_FAILED"
      },
      { status: 500 }
    );
  }
}





