import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // 開発時に気づきやすいようにログを出す
  console.warn(
    "Supabase の環境変数 NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY が設定されていません。"
  );
}

// サーバーコンポーネント/Route Handlers から使う簡易クライアント
export function createSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase クライアントを初期化できません。環境変数を確認してください。"
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false
    }
  });
}

// サーバー専用: RLSをバイパスするサービスロールクライアント
// interview_sessions などのテーブルにアクセスする際に使用
export function createSupabaseServiceClient() {
  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL が設定されていません。");
  }

  // サービスロールキーがあればそれを使用、なければ anon キーでフォールバック
  const key = supabaseServiceRoleKey || supabaseAnonKey;
  if (!key) {
    throw new Error("Supabase のキーが設定されていません。");
  }

  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}


