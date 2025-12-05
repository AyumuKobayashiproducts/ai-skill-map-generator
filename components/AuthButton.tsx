"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowserClient";
import { Button } from "@/components/ui/button";

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

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
  };

  if (initializing) {
    return null;
  }

  const displayEmail =
    user?.email && user.email.length > 22
      ? `${user.email.slice(0, 19)}...`
      : user?.email ?? "ユーザー";

  return (
    <div className="flex items-center gap-2 text-xs">
      {user && (
        <span className="inline-flex max-w-[140px] items-center rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-600 truncate">
          ログイン中: {displayEmail}
        </span>
      )}
      {user ? (
        <Button type="button" size="sm" variant="outline" onClick={handleLogout}>
          ログアウト
        </Button>
      ) : (
        <Link href="/auth/login">
          <Button type="button" size="sm" variant="outline">
            ログイン
          </Button>
        </Link>
      )}
    </div>
  );
}


