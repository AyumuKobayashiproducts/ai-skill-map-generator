"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowserClient";

export default function AuthCallbackPage() {
  const [message, setMessage] = useState("ログイン処理中です...");
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        // すでに Supabase 側でセッションが作られているか確認
        const { data } = await supabase.auth.getUser();

        if (data.user) {
          setMessage("ログインに成功しました。画面を戻ります...");
          setTimeout(() => {
            router.push("/");
          }, 1500);
          return;
        }

        // 古いフローで code パラメータ付きで遷移してきた場合のフォールバック
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");

        if (!code) {
          setMessage("ログインに失敗しました。もう一度お試しください。");
          return;
        }

        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          console.error("Auth callback error", error);
          setMessage("ログインに失敗しました。もう一度お試しください。");
          return;
        }

        setMessage("ログインに成功しました。画面を戻ります...");
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } catch (e) {
        console.error(e);
        setMessage("予期しないエラーが発生しました。");
      }
    };

    handleAuth();
  }, [router]);

  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <p className="text-sm text-slate-700">{message}</p>
    </div>
  );
}


