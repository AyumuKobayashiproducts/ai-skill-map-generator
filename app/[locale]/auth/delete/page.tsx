import DeleteAccountPage from "../../../auth/delete/page";

// ロケール付きのアカウント削除ページ。
// ミドルウェアにより `/ja/auth/delete` や `/en/auth/delete` にリライトされた場合でも
// 既存の `/auth/delete` と同じ UI を表示するためのラッパー。
export default function LocaleDeleteAccountPage() {
  return <DeleteAccountPage />;
}







