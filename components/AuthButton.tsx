"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowserClient";
import { Button } from "@/components/ui/button";

// ルートレイアウト（NextIntlClientProvider の外）でも使われるため、
// useTranslations を使わず locale に基づいた固定テキストを使用する
const labels = {
  ja: {
    guestLoginPrimary: "ログイン / 登録",
    guestLoginMobile: "ログイン",
    loggedInLabel: "ログイン中",
    menuDashboard: "ダッシュボード",
    menuSettings: "アカウント設定",
    menuLogout: "ログアウト",
    defaultUserLabel: "ユーザー"
  },
  en: {
    guestLoginPrimary: "Login / Sign up",
    guestLoginMobile: "Login",
    loggedInLabel: "Logged in",
    menuDashboard: "Dashboard",
    menuSettings: "Account Settings",
    menuLogout: "Logout",
    defaultUserLabel: "User"
  }
} as const;

export function AuthButton() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  // locale の判定
  const segments = (pathname ?? "").split("/");
  const firstSegment = segments[1] ?? "";
  const locale: "ja" | "en" = firstSegment === "en" ? "en" : "ja";
  const t = labels[locale];

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    supabase.auth
      .getUser()
      .then(({ data }) => {
        setUser(data.user ?? null);
      })
      .finally(() => setInitializing(false));

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    setShowMenu(false);
  };

  if (initializing) {
    return (
      <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />
    );
  }

  const loginHref = `/${locale}/auth/login`;

  const displayEmail =
    user?.email && user.email.length > 20
      ? `${user.email.slice(0, 17)}...`
      : user?.email ?? t.defaultUserLabel;

  const initials = user?.email 
    ? user.email.slice(0, 2).toUpperCase() 
    : "U";

  if (user) {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
            {initials}
          </div>
          <svg 
            className={`w-4 h-4 text-slate-500 transition-transform duration-200 hidden sm:block ${showMenu ? "rotate-180" : ""}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showMenu && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowMenu(false)} 
            />
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 z-50 overflow-hidden animate-scale-in">
              <div className="p-3 border-b border-slate-100 bg-slate-50">
                <p className="text-xs text-slate-500">
                  {t.loggedInLabel}
                </p>
                <p className="text-sm font-medium text-slate-900 truncate mt-0.5">
                  {displayEmail}
                </p>
              </div>
              <div className="p-2">
                <Link
                  href={`/${locale}/dashboard`}
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <span>📊</span>
                  {t.menuDashboard}
                </Link>
                <Link
                  href="/auth/delete"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <span>⚙️</span>
                  {t.menuSettings}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <span>🚪</span>
                  {t.menuLogout}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <Link href={loginHref}>
      <Button type="button" size="sm">
        <span className="hidden sm:inline">
          {t.guestLoginPrimary}
        </span>
        <span className="sm:hidden">
          {t.guestLoginMobile}
        </span>
      </Button>
    </Link>
  );
}
