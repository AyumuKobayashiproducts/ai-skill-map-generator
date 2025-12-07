import { NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabaseClient";
import { getRequestLocale } from "@/lib/apiLocale";
import { getApiError } from "@/lib/apiErrors";

// 簡易的に userId クエリパラメータでフィルタリング（デモ用途）
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const supabase = createSupabaseClient();

    let query = supabase
      .from("skill_maps")
      .select("id, created_at, categories, user_id")
      .order("created_at", { ascending: false });

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase fetch error", error);
      const locale = getRequestLocale(request);
      const { code, message } = getApiError("MAPS_FETCH_FAILED", locale);
      return NextResponse.json(
        { error: message, code },
        { status: 500 }
      );
    }

    const result =
      data?.map((row) => ({
        id: row.id as string,
        createdAt: row.created_at as string,
        categories: (row.categories ?? {}) as Record<string, number>,
        userId: row.user_id as string | null
      })) ?? [];

    return NextResponse.json(result);
  } catch (error) {
    console.error("Maps API error", error);
    const locale = getRequestLocale(request);
    const { code, message } = getApiError("MAPS_FETCH_FAILED", locale);
    return NextResponse.json(
      { error: message, code },
      { status: 500 }
    );
  }
}


