import AuthCallbackPage from "../../../auth/callback/page";

// ロケール付きの認証コールバック。
// Supabase からのリダイレクトを next-intl のミドルウェアが `/[locale]/auth/callback` に書き換えても
// 正しく処理できるように、既存の `/auth/callback` ページをそのまま再利用する。
export default function LocaleAuthCallbackPage() {
  return <AuthCallbackPage />;
}


