"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowserClient";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ui/error-alert";

export default function AuthLoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!email.trim() || !password.trim()) {
      setError("メールアドレスとパスワードを入力してください。");
      return;
    }

    setLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();

      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) {
          throw error;
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password
        });
        if (error) {
          throw error;
        }
      }

      router.push("/");
    } catch (e) {
      console.error(e);
      setError(
        mode === "login"
          ? "ログインに失敗しました。メールアドレスとパスワードを確認してください。"
          : "新規登録に失敗しました。入力内容を確認し、時間をおいて再度お試しください。"
      );
    } finally {
      setLoading(false);
    }
  };

  const [resetEmail, setResetEmail] = useState("");

  const handleResetPassword = async () => {
    setError(null);
    setInfo(null);

    const targetEmail = (resetEmail || email).trim();

    if (!targetEmail) {
      setError(
        "パスワードを再設定したいメールアドレスを、下の入力欄に入力してください。"
      );
      return;
    }

    setLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.resetPasswordForEmail(targetEmail, {
        redirectTo: `${window.location.origin}/auth/reset`
      });
      if (error) {
        throw error;
      }
      setInfo(
        "パスワード再設定用のメールを送信しました。メールボックス（迷惑メールフォルダも含む）を確認してください。"
      );
    } catch (e) {
      console.error(e);
      setError(
        "パスワード再設定メールの送信に失敗しました。時間をおいてから、もう一度お試しください。"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto space-y-4">
      <div>
        <h2 className="text-xl font-semibold">
          {mode === "login" ? "ログイン" : "新規登録"}
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          メールアドレスとパスワードを使ってサインインできます。
        </p>
      </div>

      <div className="flex gap-2 text-xs">
        <button
          type="button"
          className={`px-3 py-1 rounded-full border ${
            mode === "login"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background text-muted-foreground border-border"
          }`}
          onClick={() => setMode("login")}
        >
          ログイン
        </button>
        <button
          type="button"
          className={`px-3 py-1 rounded-full border ${
            mode === "signup"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background text-muted-foreground border-border"
          }`}
          onClick={() => setMode("signup")}
        >
          新規登録
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 text-sm">
        <div className="space-y-1">
          <label className="block text-xs font-medium">メールアドレス</label>
          <input
            type="email"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium">パスワード</label>
          <input
            type="password"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="8文字以上を推奨"
          />
        </div>

        {error && <ErrorAlert message={error} />}
        {info && !error && (
          <p className="text-[11px] text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-md px-2 py-1">
            {info}
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full mt-1">
          {loading
            ? mode === "login"
              ? "ログイン中..."
              : "登録中..."
            : mode === "login"
            ? "ログイン"
            : "新規登録してログイン"}
        </Button>
      </form>

      <div className="space-y-2 text-[11px] text-slate-600">
        <div className="space-y-1">
          <label className="block text-[11px] font-medium">
            パスワード再設定用メールアドレス
          </label>
          <input
            type="email"
            className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-[11px] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            placeholder="再設定メールを受け取りたいアドレス"
          />
          <p className="text-[11px] text-muted-foreground">
            上のメールアドレスと同じでよければ、入力を省略して構いません。
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetPassword}
          className="underline underline-offset-2 hover:text-slate-900"
          disabled={loading}
        >
          パスワードを忘れた場合はこちら（再設定メールを送信）
        </button>
        <p>
          アカウントとスキルマップを削除したい場合は{" "}
          <a
            href="/auth/delete"
            className="underline underline-offset-2 hover:text-slate-900"
          >
            アカウント削除ページ
          </a>
          を開いてください。
        </p>
      </div>
    </div>
  );
}


