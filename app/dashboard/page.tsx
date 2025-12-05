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

const categoryEmojis: Record<string, string> = {
  frontend: "🎨",
  backend: "⚔️",
  infra: "🛡️",
  ai: "🧪",
  tools: "🔧"
};

const categoryLabels: Record<string, string> = {
  frontend: "フロントエンド",
  backend: "バックエンド",
  infra: "インフラ",
  ai: "AI",
  tools: "ツール"
};

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
    if (!latest) return { text: "", emoji: "" };
    const categories = latest.categories ?? {};
    const entries = Object.entries(categories).filter(
      ([, v]) => v !== null && v !== undefined
    ) as [string, number][];
    if (entries.length === 0) return { text: "", emoji: "" };
    const first = entries.sort((a, b) => b[1] - a[1])[0];
    if (!first) return { text: "", emoji: "" };
    const [key] = first;
    const taglines: Record<string, { text: string; emoji: string }> = {
      frontend: { text: "UI/UX へのこだわりが強いフロント寄りエンジニアです。", emoji: "🎨" },
      backend: { text: "ビジネスロジックとデータ設計が得意なバックエンド寄りエンジニアです。", emoji: "⚔️" },
      infra: { text: "安定稼働や運用を意識したインフラ志向のエンジニアです。", emoji: "🛡️" },
      ai: { text: "AI 技術をプロダクトに組み込むことに関心の高いエンジニアです。", emoji: "🧪" },
      tools: { text: "開発効率を最大化するツール選定やワークフロー改善が得意です。", emoji: "🔧" }
    };
    return taglines[key] ?? { text: "", emoji: "" };
  })();

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <span>📊</span>
          スキルマップ履歴
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          直近の解析結果から、あなたのスキルバランスの変化をざっくり振り返ることができます。
        </p>
        {user && (
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            ログイン中のユーザーに紐づく診断結果のみを表示しています。
          </p>
        )}
        {!user && (
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            ログインしていないため、全体の診断履歴を表示しています（デモ用）。
          </p>
        )}
        {tagline.text && (
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-sky-50 via-white to-indigo-50 border border-sky-100">
            <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <span className="text-lg">{tagline.emoji}</span>
              今のあなたを一言で表すと:
              <span className="gradient-text font-semibold">{tagline.text}</span>
            </p>
          </div>
        )}
      </div>

      {error && <ErrorAlert message={error} />}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-20 rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 animate-fade-in">
          <div className="text-4xl mb-3">📝</div>
          <p className="text-sm text-slate-600">
            まだスキルマップが生成されていません。
          </p>
          <Link
            href="/"
            className="inline-block mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 text-white text-sm font-medium shadow-lg shadow-sky-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            ホーム画面から新規作成
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((item, idx) => {
            const categories = item.categories ?? {};
            const totalScore = Object.values(categories).reduce<number>(
              (sum, v) => sum + (v ?? 0),
              0
            );

            const entries = Object.entries(categories).filter(
              ([, v]) => v !== null && v !== undefined
            ) as [string, number][];
            const top =
              entries.length > 0
                ? entries.sort((a, b) => b[1] - a[1])[0]
                : null;

            const created = new Date(item.createdAt);

            return (
              <li 
                key={item.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <Link
                  href={`/result/${item.id}`}
                  className="group block rounded-xl border border-slate-200 bg-white p-4 shadow-sm card-hover"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">
                          {created.toLocaleString("ja-JP", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                        {idx === 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 text-[10px] font-semibold">
                            最新
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs">
                          <span>📊</span>
                          合計: <span className="font-semibold text-slate-900">{totalScore}</span>
                        </div>
                        {top && (
                          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-sky-100 to-indigo-100 text-sky-700 text-xs font-medium">
                            <span>{categoryEmojis[top[0]] ?? "⭐"}</span>
                            {categoryLabels[top[0]] ?? top[0]}: Lv.{top[1]}
                          </div>
                        )}
                      </div>

                      {/* ミニスキルバー */}
                      <div className="flex gap-1 mt-3">
                        {Object.entries(categories)
                          .filter(([, v]) => v !== null && v !== undefined)
                          .map(([key, value]) => (
                            <div
                              key={key}
                              className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden"
                              title={`${categoryLabels[key] ?? key}: ${value}`}
                            >
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-400"
                                style={{ width: `${((value ?? 0) / 5) * 100}%` }}
                              />
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-sky-600 font-medium group-hover:text-sky-700 transition-colors">
                      詳細
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
