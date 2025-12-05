"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  const [showPassword, setShowPassword] = useState(false);
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
  const [showResetForm, setShowResetForm] = useState(false);

  const handleResetPassword = async () => {
    setError(null);
    setInfo(null);

    const targetEmail = (resetEmail || email).trim();

    if (!targetEmail) {
      setError(
        "パスワードを再設定したいメールアドレスを入力してください。"
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
      setShowResetForm(false);
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
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-md space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 via-indigo-500 to-emerald-400 flex items-center justify-center text-white text-3xl shadow-xl shadow-sky-500/25 mx-auto">
            🔐
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {mode === "login" ? "おかえりなさい" : "はじめまして"}
          </h2>
          <p className="text-sm text-slate-600">
            {mode === "login" 
              ? "メールアドレスとパスワードでログイン" 
              : "新しいアカウントを作成"}
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === "login"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
            onClick={() => setMode("login")}
          >
            ログイン
          </button>
          <button
            type="button"
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === "signup"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
            onClick={() => setMode("signup")}
          >
            新規登録
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <span>📧</span>
              メールアドレス
            </label>
            <input
              type="email"
              className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition-all duration-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <span>🔑</span>
              パスワード
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 pr-12 text-sm shadow-sm transition-all duration-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "signup" ? "8文字以上を推奨" : "••••••••"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {error && <ErrorAlert message={error} />}
          
          {info && !error && (
            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 animate-fade-in">
              <span className="text-lg">✅</span>
              <p className="text-sm text-emerald-700">{info}</p>
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full" size="lg">
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {mode === "login" ? "ログイン中..." : "登録中..."}
              </>
            ) : (
              <>
                <span>{mode === "login" ? "🚀" : "✨"}</span>
                {mode === "login" ? "ログイン" : "新規登録してログイン"}
              </>
            )}
          </Button>
        </form>

        {/* Password reset */}
        <div className="space-y-3">
          {!showResetForm ? (
            <button
              type="button"
              onClick={() => setShowResetForm(true)}
              className="w-full text-center text-sm text-slate-500 hover:text-sky-600 transition-colors"
            >
              パスワードを忘れた場合
            </button>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 animate-fade-in">
              <p className="text-xs font-medium text-slate-700">
                パスワードを再設定
              </p>
              <input
                type="email"
                className="w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition-all duration-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 focus:outline-none"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="再設定メールを受け取るアドレス"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setShowResetForm(false)}
                >
                  キャンセル
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleResetPassword}
                  disabled={loading}
                >
                  送信
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer links */}
        <div className="text-center space-y-2 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            アカウントを削除したい場合は{" "}
            <Link
              href="/auth/delete"
              className="text-sky-600 hover:text-sky-700 underline underline-offset-2"
            >
              アカウント削除ページ
            </Link>
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 transition-colors"
          >
            ← ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
