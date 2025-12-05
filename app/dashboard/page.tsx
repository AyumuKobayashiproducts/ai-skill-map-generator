"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowserClient";
import { ErrorAlert } from "@/components/ui/error-alert";

interface SkillMapListItem {
  id: string;
  createdAt: string;
  categories: Record<string, number | null>;
  userId: string | null;
}

export default function DashboardPage() {
  const [items, setItems] = useState<SkillMapListItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const {
          data: { user }
        } = await supabase.auth.getUser();
        setUser(user ?? null);

        const query = user
          ? `/api/maps?userId=${encodeURIComponent(user.id)}`
          : "/api/maps";

        const res = await fetch(query, { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error ?? "一覧の取得に失敗しました。");
        }

        setItems(data as SkillMapListItem[]);
      } catch (e) {
        console.error(e);
        setError(
          e instanceof Error ? e.message : "一覧取得中にエラーが発生しました。"
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const latest = items[0];

  const tagline = (() => {
    if (!latest) return "";
    const categories = latest.categories ?? {};
    const entries = Object.entries(categories).filter(
      ([, v]) => v != null
    ) as [string, number][];
    if (entries.length === 0) return "";
    const first = entries.sort((a, b) => b[1] - a[1])[0];
    if (!first) return "";
    const [key] = first;
    switch (key) {
      case "frontend":
        return "UI/UX へのこだわりが強いフロント寄りエンジニアです。";
      case "backend":
        return "ビジネスロジックとデータ設計が得意なバックエンド寄りエンジニアです。";
      case "infra":
        return "安定稼働や運用を意識したインフラ志向のエンジニアです。";
      case "ai":
        return "AI 技術をプロダクトに組み込むことに関心の高いエンジニアです。";
      case "tools":
        return "開発効率を最大化するツール選定やワークフロー改善が得意です。";
      default:
        return "";
    }
  })();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">スキルマップ履歴</h2>
        <p className="text-sm text-muted-foreground mt-1">
          直近の解析結果から、あなたのスキルバランスの変化をざっくり振り返ることができます。
        </p>
        {user && (
          <p className="text-xs text-slate-500 mt-1">
            ログイン中のユーザーに紐づく診断結果のみを表示しています。
          </p>
        )}
        {!user && (
          <p className="text-xs text-slate-500 mt-1">
            ログインしていないため、全体の診断履歴を表示しています（デモ用）。
          </p>
        )}
        {tagline && (
          <p className="mt-2 text-sm font-medium text-primary">
            今のあなたを一言で表すと: {tagline}
          </p>
        )}
      </div>

      {error && <ErrorAlert message={error} />}

      {loading ? (
        <p className="text-sm text-muted-foreground">読み込み中です...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          まだスキルマップが生成されていません。ホーム画面から新規作成してください。
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => {
            const categories = item.categories ?? {};
            const totalScore = Object.values(categories).reduce<number>(
              (sum, v) => sum + (v ?? 0),
              0
            );

            const entries = Object.entries(categories).filter(
              ([, v]) => v != null
            ) as [string, number][];
            const top =
              entries.length > 0
                ? entries.sort((a, b) => b[1] - a[1])[0]
                : null;

            const created = new Date(item.createdAt);

            return (
              <li key={item.id}>
                <Link
                  href={`/result/${item.id}`}
                  className="flex items-center justify-between border rounded-lg px-4 py-3 hover:bg-muted transition-colors"
                >
                  <div>
                    <div className="text-sm font-medium">
                      {created.toLocaleString("ja-JP", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        合計スコア: {totalScore}
                      </span>
                      {top && (
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                          メイン強み: {top[0]}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-primary underline">
                    詳細を見る
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

