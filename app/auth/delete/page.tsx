"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowserClient";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ui/error-alert";

export default function DeleteAccountPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  const handleDelete = async () => {
    setError(null);
    setDone(false);
    setLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      const userId = data.user?.id;
      if (!userId) {
        throw new Error("ログイン情報が取得できませんでした。");
      }

      // このアプリで保存しているデータを削除（認証ユーザー自体の削除はサービスキーが必要なため対象外）
      await supabase.from("skill_maps").delete().eq("user_id", userId);
      await supabase.from("usage_logs").delete().eq("user_id", userId);
      await supabase.from("profiles").delete().eq("id", userId);

      await supabase.auth.signOut();

      setDone(true);
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (e) {
      console.error(e);
      setError(
        "アカウントデータの削除に失敗しました。時間をおいてから、もう一度お試しください。"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto space-y-4">
      <div>
        <h2 className="text-xl font-semibold">アカウント削除</h2>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          このページでは、AI Skill Map Generator 上に保存された
          スキルマップや利用ログなどのデータを削除できます。
          （Supabase の認証アカウントそのものの削除は対象外です。）
        </p>
      </div>

      {email ? (
        <p className="text-xs text-slate-700">
          現在ログイン中のメールアドレス:{" "}
          <span className="font-semibold">{email}</span>
        </p>
      ) : (
        <p className="text-xs text-red-600">
          ログインしていないため、削除対象のアカウントを特定できません。
          先に右上の「ログイン」からサインインしてください。
        </p>
      )}

      {error && <ErrorAlert message={error} />}
      {done && !error && (
        <p className="text-[11px] text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-md px-2 py-1">
          アカウントデータを削除しました。トップページに戻ります。
        </p>
      )}

      <div className="space-y-2 text-xs">
        <p className="text-slate-700">
          削除すると、このアプリに保存されたスキルマップ履歴や利用ログは復元できません。
        </p>
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            className="mt-[2px]"
            checked={confirm}
            onChange={(e) => setConfirm(e.target.checked)}
            disabled={loading || !email}
          />
          <span>
            上記の内容を理解したうえで、このアプリに保存された自分のデータを削除します。
          </span>
        </label>
        <Button
          type="button"
          variant="outline"
          disabled={loading || !email || !confirm}
          onClick={handleDelete}
          className="w-full border-red-300 text-red-700 hover:bg-red-50"
        >
          {loading ? "削除中..." : "このアプリの保存データを削除する"}
        </Button>
      </div>
    </div>
  );
}


