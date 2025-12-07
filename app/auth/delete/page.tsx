"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowserClient";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ui/error-alert";
import { useTranslations } from "next-intl";

export default function DeleteAccountPage() {
  const t = useTranslations("authDelete");
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
        throw new Error(t("errors.noUser"));
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
        t("errors.deleteFailed")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto space-y-4">
      <div>
        <h2 className="text-xl font-semibold">{t("hero.title")}</h2>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          {t("hero.body")}
        </p>
      </div>

      {email ? (
        <p className="text-xs text-slate-700">
          {t("status.currentEmail", { email })}
        </p>
      ) : (
        <p className="text-xs text-red-600">
          {t("status.notLoggedIn")}
        </p>
      )}

      {error && <ErrorAlert message={error} />}
      {done && !error && (
        <p className="text-[11px] text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-md px-2 py-1">
          {t("status.deleted")}
        </p>
      )}

      <div className="space-y-2 text-xs">
        <p className="text-slate-700">
          {t("confirm.warning")}
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
            {t("confirm.label")}
          </span>
        </label>
        <Button
          type="button"
          variant="outline"
          disabled={loading || !email || !confirm}
          onClick={handleDelete}
          className="w-full border-red-300 text-red-700 hover:bg-red-50"
        >
          {loading ? t("button.deleting") : t("button.delete")}
        </Button>
      </div>
    </div>
  );
}


