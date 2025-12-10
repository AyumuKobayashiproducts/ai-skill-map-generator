"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowserClient";

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

/**
 * 認証状態を管理するカスタムフック
 * Supabase Authを使用してユーザーの認証状態を追跡
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    // 初期ユーザー取得
    const getInitialUser = async () => {
      try {
        const { data, error: authError } = await supabase.auth.getUser();
        if (authError) {
          throw authError;
        }
        setUser(data.user);
      } catch (e) {
        console.error("Auth error:", e);
        setError(e instanceof Error ? e : new Error("認証エラーが発生しました"));
      } finally {
        setLoading(false);
      }
    };

    void getInitialUser();

    // 認証状態の変更を監視
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (signInError) {
        throw signInError;
      }
    } catch (e) {
      const err = e instanceof Error ? e : new Error("ログインに失敗しました");
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password
      });
      if (signUpError) {
        throw signUpError;
      }
    } catch (e) {
      const err = e instanceof Error ? e : new Error("新規登録に失敗しました");
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        throw signOutError;
      }
    } catch (e) {
      const err = e instanceof Error ? e : new Error("ログアウトに失敗しました");
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset`
      });
      if (resetError) {
        throw resetError;
      }
    } catch (e) {
      const err = e instanceof Error ? e : new Error("パスワードリセットに失敗しました");
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword
  };
}











