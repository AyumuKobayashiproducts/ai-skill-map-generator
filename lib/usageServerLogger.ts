import { createSupabaseClient } from "@/lib/supabaseClient";

type UsageMeta = Record<string, unknown>;

// サーバーサイド用の usage_logs 送信用ヘルパー
// エラーが起きても呼び出し元の挙動には影響させない（ログはベストエフォート）
export async function logUsageServer(event: string, meta?: UsageMeta) {
  try {
    const supabase = createSupabaseClient();
    await supabase.from("usage_logs").insert({
      event,
      user_id: null,
      meta: meta ?? null
    });
  } catch (error) {
    console.error("logUsageServer error", error);
  }
}








