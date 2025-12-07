import { NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabaseClient";
import { UsageLogRequestSchema } from "@/types/api";
import { getRequestLocale } from "@/lib/apiLocale";
import { getApiError } from "@/lib/apiErrors";

export async function POST(request: Request) {
  try {
    const body = UsageLogRequestSchema.parse(await request.json());
    const supabase = createSupabaseClient();

    const { error } = await supabase.from("usage_logs").insert({
      event: body.event,
      user_id: body.userId ?? null,
      meta: body.meta ?? null
    });

    if (error) {
      console.error("Usage log insert error", error);
      const locale = getRequestLocale(request);
      const { code, message } = getApiError(
        "USAGE_LOG_INSERT_FAILED",
        locale
      );
      return NextResponse.json(
        { error: message, code },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Usage log API error", error);
    const locale = getRequestLocale(request);
    const { code, message } = getApiError("USAGE_LOG_ERROR", locale);
    return NextResponse.json({ error: message, code }, { status: 500 });
  }
}


