"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowserClient";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ui/error-alert";
import { useTranslations } from "next-intl";

export default function ResetPasswordPage() {
  const t = useTranslations("authReset");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password.trim() || !confirm.trim()) {
      setError(t("errors.missing"));
      return;
    }

    if (password !== confirm) {
      setError(t("errors.notMatch"));
      return;
    }

    if (password.length < 8) {
      setError(t("errors.tooShort"));
      return;
    }

    setLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.updateUser({
        password
      });
      if (error) {
        throw error;
      }
      setDone(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    } catch (e) {
      console.error(e);
      setError(
        t("errors.updateFailed")
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

      <form onSubmit={handleSubmit} className="space-y-3 text-sm">
        <div className="space-y-1">
          <label className="block text-xs font-medium">
            {t("form.passwordLabel")}
          </label>
          <input
            type="password"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("form.passwordPlaceholder")}
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium">
            {t("form.confirmLabel")}
          </label>
          <input
            type="password"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder={t("form.confirmPlaceholder")}
          />
        </div>

        {error && <ErrorAlert message={error} />}
        {done && !error && (
          <p className="text-[11px] text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-md px-2 py-1">
            {t("status.updated")}
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full mt-1">
          {loading ? t("button.updating") : t("button.update")}
        </Button>
      </form>
    </div>
  );
}


