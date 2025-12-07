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
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white text-xl shadow-md">
                📊
              </div>
              スキルマップ履歴
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              直近の解析結果から、あなたのスキルバランスの変化をざっくり振り返ることができます。
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white text-sm font-bold shadow-lg shadow-sky-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            <span className="text-lg">✨</span>
            新しく診断する
          </Link>
        </div>
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
          <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-sky-50 via-indigo-50 to-purple-50 border-2 border-sky-200 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white text-2xl shadow-md flex-shrink-0">
                {tagline.emoji}
              </div>
              <div className="flex-1 pt-1">
                <p className="text-xs font-semibold text-sky-700 uppercase tracking-wider mb-1">
                  あなたのキャリアタイプ
                </p>
                <p className="text-base font-bold text-slate-900 leading-relaxed">
                  {tagline.text}
                </p>
              </div>
            </div>
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
        <div className="text-center py-16 animate-fade-in">
          <div className="relative inline-block mb-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-sky-100 via-indigo-100 to-purple-100 flex items-center justify-center">
              <div className="text-6xl">📝</div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center text-white text-2xl shadow-lg animate-bounce">
              ✨
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">
            さあ、最初の診断を始めましょう
          </h3>
          <p className="text-base text-slate-600 mb-2 max-w-md mx-auto leading-relaxed">
            まだスキルマップが生成されていません。
            <br />
            たった60秒で、あなただけのキャリアマップが完成します。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8 max-w-md mx-auto">
            <Link
              href="/"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 text-white text-base font-bold shadow-xl shadow-sky-500/30 hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">🚀</span>
              診断を始める
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-slate-300 bg-white text-slate-700 text-base font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all"
            >
              <span className="text-xl">ℹ️</span>
              使い方を見る
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg mx-auto text-xs text-slate-600">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-lg">
                ⚡
              </div>
              <span>60秒で完了</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-lg">
                🔒
              </div>
              <span>データは安全</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-lg">
                💯
              </div>
              <span>完全無料</span>
            </div>
          </div>
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
                  className="group block rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-sm card-hover hover:border-sky-300 hover:shadow-xl hover:shadow-sky-100 transition-all duration-300"
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
