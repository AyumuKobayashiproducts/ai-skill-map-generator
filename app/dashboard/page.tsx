"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { useTranslations } from "next-intl";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowserClient";
import { ErrorAlert } from "@/components/ui/error-alert";
import type { InterviewSessionRecord } from "@/types/skill";
import { DemoGuideBanner } from "@/components/DemoGuideBanner";

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
  frontend: "frontend",
  backend: "backend",
  infra: "infra",
  ai: "ai",
  tools: "tools"
};

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const [items, setItems] = useState<SkillMapListItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interviewSessions, setInterviewSessions] = useState<InterviewSessionRecord[]>([]);
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [interviewError, setInterviewError] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

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
          throw new Error(
            data?.error ?? t("errors.listFetchDefault")
          );
        }

        setItems(data as SkillMapListItem[]);
      } catch (e) {
        console.error(e);
        setError(
          e instanceof Error ? e.message : t("errors.listFetchGeneric")
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [t]);

  // 1on1 セッション情報の読み込み
  useEffect(() => {
    const loadInterview = async () => {
      try {
        setInterviewLoading(true);
        setInterviewError(null);

        // 直近のスキルマップに紐づく 1on1 セッションを取得（あれば）
        const latestMapId = items[0]?.id;
        const query = latestMapId
          ? `/api/oneonone/sessions?skillMapId=${encodeURIComponent(
              latestMapId
            )}&limit=20`
          : null;

        if (!query) {
          setInterviewSessions([]);
          return;
        }

        const res = await fetch(query, { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(
            data?.error ?? t("errors.sessionsFetchDefault")
          );
        }

        setInterviewSessions((data.sessions ?? []) as InterviewSessionRecord[]);
      } catch (e) {
        console.error(e);
        setInterviewError(
          e instanceof Error
            ? e.message
            : t("errors.sessionsFetchGeneric")
        );
      } finally {
        setInterviewLoading(false);
      }
    };

    // 一覧が取れてから動かす
    if (items.length > 0) {
      void loadInterview();
    }
  }, [items, t]);

  // 転職準備チェックリスト（ローカルストレージ保存）
  const checklistItems = [
    {
      id: "resume_updated"
    },
    {
      id: "github_ready"
    },
    {
      id: "job_research"
    },
    {
      id: "interview_practice"
    }
  ] as const;

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("readinessChecklistV1");
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, boolean>;
        setChecklist(parsed);
      }
    } catch {
      // 失敗しても無視
    }
  }, []);

  const toggleChecklist = (id: string) => {
    setChecklist((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem("readinessChecklistV1", JSON.stringify(next));
        } catch {
          // noop
        }
      }
      return next;
    });
  };

  const latest = items[0];

  const interviewStats = useMemo(() => {
    if (!interviewSessions.length) {
      return null;
    }

    const totalSessions = interviewSessions.length;
    const totalScore = interviewSessions.reduce((sum, s) => {
      return sum + (s.overall_score ?? 0);
    }, 0);
    const avgScore = totalSessions > 0 ? totalScore / totalSessions : null;

    const byType: Record<
      string,
      { count: number; scoreSum: number; latestAt: string }
    > = {};

    for (const s of interviewSessions) {
      const type = s.interview_type ?? "unknown";
      if (!byType[type]) {
        byType[type] = {
          count: 0,
          scoreSum: 0,
          latestAt: s.created_at
        };
      }
      byType[type].count += 1;
      byType[type].scoreSum += s.overall_score ?? 0;
      // created_at は降順で来ているとは限らないので、自前で比較
      if (new Date(s.created_at) > new Date(byType[type].latestAt)) {
        byType[type].latestAt = s.created_at;
      }
    }

    const typeOrder: { key: string; label: string; emoji: string }[] = [
      { key: "general", label: "総合", emoji: "🗣️" },
      { key: "technical", label: "技術", emoji: "💻" },
      { key: "behavioral", label: "行動・スタンス", emoji: "🧭" },
      { key: "unknown", label: "その他", emoji: "🎯" }
    ];

    const typeStats = typeOrder
      .map((t) => {
        const v = byType[t.key];
        if (!v) return null;
        return {
          key: t.key,
          label: t.label,
          emoji: t.emoji,
          count: v.count,
          avgScore: v.count > 0 ? v.scoreSum / v.count : null
        };
      })
      .filter(Boolean) as {
      key: string;
      label: string;
      emoji: string;
      count: number;
      avgScore: number | null;
    }[];

    const latestSession = interviewSessions[0];

    return {
      totalSessions,
      avgScore,
      typeStats,
      latestSession
    };
  }, [interviewSessions]);

  const daysSinceLast = useMemo(() => {
    if (!latest) return null;
    const created = new Date(latest.createdAt);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? diffDays : null;
  }, [latest]);

  const scoreTrend = useMemo(() => {
    if (!items.length) return null;

    const mapped = items.map((item) => {
      const categories = item.categories ?? {};
      const totalScore = Object.values(categories).reduce<number>(
        (sum, v) => sum + (v ?? 0),
        0
      );
      return {
        id: item.id,
        createdAt: item.createdAt,
        totalScore
      };
    });

    if (!mapped.length) return null;

    const latestPoint = mapped[0]!;
    const prevPoint = mapped[1] ?? null;
    const diff = prevPoint
      ? latestPoint.totalScore - prevPoint.totalScore
      : null;
    const maxScore =
      mapped.reduce((max, p) => Math.max(max, p.totalScore), 0) || 1;

    return {
      points: mapped.slice(0, 8).reverse(), // 古い順に並べてスパークライン表示
      latest: latestPoint,
      prev: prevPoint,
      diff,
      maxScore
    };
  }, [items]);

  const categoryTrends = useMemo(() => {
    if (items.length < 2) return null;

    const [latestItem, prevItem] = items;
    const latestCategories = latestItem?.categories ?? {};
    const prevCategories = prevItem?.categories ?? {};

    const trends = Object.keys(categoryLabels).map((key) => {
      const latestValue = (latestCategories as Record<string, number | null>)[
        key
      ];
      const prevValue = (prevCategories as Record<string, number | null>)[key];

      if (
        (latestValue === null || latestValue === undefined) &&
        (prevValue === null || prevValue === undefined)
      ) {
        return null;
      }

      const diff =
        latestValue !== null &&
        latestValue !== undefined &&
        prevValue !== null &&
        prevValue !== undefined
          ? latestValue - prevValue
          : null;

      return {
        key,
        label: categoryLabels[key] ?? key,
        emoji: categoryEmojis[key] ?? "⭐",
        latestValue: latestValue ?? null,
        prevValue: prevValue ?? null,
        diff
      };
    });

    const valid = trends.filter(Boolean) as {
      key: string;
      label: string;
      emoji: string;
      latestValue: number | null;
      prevValue: number | null;
      diff: number | null;
    }[];

    if (!valid.length) return null;

    const improved = valid
      .filter((t) => (t.diff ?? 0) > 0)
      .sort((a, b) => (b.diff ?? 0) - (a.diff ?? 0));
    const declined = valid
      .filter((t) => (t.diff ?? 0) < 0)
      .sort((a, b) => (a.diff ?? 0) - (b.diff ?? 0));

    return {
      all: valid,
      improved,
      declined
    };
  }, [items]);

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
      frontend: { text: t("tagline.frontend"), emoji: "🎨" },
      backend: { text: t("tagline.backend"), emoji: "⚔️" },
      infra: { text: t("tagline.infra"), emoji: "🛡️" },
      ai: { text: t("tagline.ai"), emoji: "🧪" },
      tools: { text: t("tagline.tools"), emoji: "🔧" }
    };
    return taglines[key] ?? { text: "", emoji: "" };
  })();

  const isDemo = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("demo") === "2";

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
              <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white text-xl shadow-md">
                📊
              </div>
              {t("skillMapHistory.title")}
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              {t("skillMapHistory.description")}
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white text-sm font-bold shadow-lg shadow-sky-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            <span className="text-lg">✨</span>
            {t("skillMapHistory.ctaNewDiagnosis")}
          </Link>
        </div>
        {user && (
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {t("skillMapHistory.loggedInNote")}
          </p>
        )}
        {!user && (
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            {t("skillMapHistory.guestNote")}
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
                  {t("skillMapHistory.careerTypeLabel")}
                </p>
                <p className="text-base font-bold text-slate-900 leading-relaxed">
                  {tagline.text}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 転職準備チェックリスト */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm animate-fade-in-up">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center text-white text-lg shadow-md">
              ✅
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                {t("checklist.title")}
              </p>
              <p className="text-xs text-slate-600">
                {t("checklist.subtitle")}
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {(() => {
            const total = checklistItems.length;
            const doneCount = checklistItems.filter((item) => checklist[item.id]).length;
            const ratio = total > 0 ? Math.round((doneCount / total) * 100) : 0;

            let levelLabel: string;
            let levelClass: string;
            if (doneCount >= total) {
              levelLabel = t("checklist.levelLabelHigh");
              levelClass = "bg-emerald-100 text-emerald-800 border-emerald-200";
            } else if (doneCount >= 2) {
              levelLabel = t("checklist.levelLabelMedium");
              levelClass = "bg-amber-100 text-amber-800 border-amber-200";
            } else {
              levelLabel = t("checklist.levelLabelLow");
              levelClass = "bg-rose-100 text-rose-800 border-rose-200";
            }

            return (
              <>
                <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
                  <span>
                    {t("checklist.completedPrefix")}{" "}
                    <span className="font-semibold">{doneCount}</span> / {total}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border font-semibold ${levelClass}`}
                  >
                    <span className="text-[10px]">
                      {t("checklist.readinessLevelLabel")}
                    </span>
                    <span>{levelLabel}</span>
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-500 transition-all"
                    style={{ width: `${ratio}%` }}
                  />
                </div>
              </>
            );
          })()}
          <ul className="space-y-1.5">
            {checklistItems.map((item) => {
              const checked = !!checklist[item.id];
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => toggleChecklist(item.id)}
                    className="flex items-start gap-2 text-xs w-full text-left rounded-lg px-2 py-1.5 hover:bg-slate-50 transition-colors"
                  >
                    <span
                      className={`mt-0.5 inline-flex items-center justify-center w-4 h-4 rounded border text-[10px] ${
                        checked
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "bg-white border-slate-300 text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                    <span className={`flex-1 ${checked ? "text-slate-700 line-through" : "text-slate-700"}`}>
                      {t(`checklist.items.${item.id}`)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* リテンション用リマインドカード */}
      {daysSinceLast !== null && daysSinceLast >= 7 && (
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-4 shadow-sm animate-fade-in-up">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-lg shadow-md">
              ⏰
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">
                {t("retention.title")}
              </p>
              <p className="text-sm text-slate-800 mb-1">
                {t("retention.line1", { days: daysSinceLast })}
              </p>
              <p className="text-xs text-slate-600 mb-2">
                {t("retention.line2")}
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
                >
                  <span>{t("retention.ctaDiagnose")}</span>
                </Link>
                {latest && (
                  <Link
                    href={`/result/${latest.id}#interview`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 font-semibold hover:bg-slate-50 transition-colors"
                  >
                    <span>{t("retention.ctaInterview")}</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* スキルスコア推移カード */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm animate-fade-in-up">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center text-white text-lg shadow-md">
              📈
            </div>
            <div>
              <p className="text-xs font-semibold text-sky-700 uppercase tracking-wide">
                {t("scoreTrend.title")}
              </p>
              <p className="text-xs text-slate-600">
                {t("scoreTrend.subtitle")}
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 text-xs font-semibold hover:bg-sky-100 transition-colors"
          >
            <span>{t("scoreTrend.ctaDiagnoseAgain")}</span>
          </Link>
        </div>

        {!scoreTrend || scoreTrend.points.length === 0 ? (
          <p className="text-xs text-slate-500">
            {t("scoreTrend.empty")}
          </p>
        ) : (
          // scoreTrend が存在し points が 1 件以上ある場合のみここに入る
          (() => {
            const trend = scoreTrend!;
            return (
          <div className="flex flex-col gap-2">
            <div className="flex items-end gap-3">
              <div>
                <p className="text-[11px] text-slate-500 mb-0.5">
                  {t("scoreTrend.latestTotal")}
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {scoreTrend.latest.totalScore}
                </p>
              </div>
              {scoreTrend.diff !== null && (
                <div className="text-xs font-semibold">
                  {scoreTrend.diff > 0 ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
                      <span>{t("scoreTrend.diffUp", { diff: scoreTrend.diff })}</span>
                    </span>
                  ) : scoreTrend.diff < 0 ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-rose-50 text-rose-700">
                      <span>{t("scoreTrend.diffDown", { diff: scoreTrend.diff })}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                      <span>{t("scoreTrend.diffSame")}</span>
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="mt-1">
              <div className="flex items-end gap-1 h-12">
                {trend.points.map((p) => {
                  const height = (p.totalScore / trend.maxScore) * 100;
                  const isLatest = p.id === trend.latest.id;
                  return (
                    <div
                      key={p.id}
                      className={`flex-1 rounded-full transition-all ${
                        isLatest
                          ? "bg-gradient-to-t from-sky-500 to-emerald-400"
                          : "bg-sky-200"
                      }`}
                      style={{ height: `${Math.max(height, 10)}%` }}
                    />
                  );
                })}
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                {t("scoreTrend.sparklineCaption")}
              </p>
            </div>
          </div>
            );
          })()
        )}
      </div>

      {/* カテゴリ別ミニトレンド */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm animate-fade-in-up">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center text-white text-lg shadow-md">
              🌱
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                {t("categoryTrend.title")}
              </p>
              <p className="text-xs text-slate-600">
                {t("categoryTrend.subtitle")}
              </p>
            </div>
          </div>
        </div>

        {!categoryTrends ? (
          <p className="text-xs text-slate-500">
            {t("categoryTrend.empty")}
          </p>
        ) : (
          // categoryTrends が存在する場合のみここに入る
          (() => {
            const trends = categoryTrends!;
            return (
          <div className="space-y-3 text-xs">
            <div>
              <p className="text-[11px] font-semibold text-emerald-700 mb-1">
                {t("categoryTrend.improvedTitle")}
              </p>
              {trends.improved.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {trends.improved.map((c) => (
                    <span
                      key={c.key}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100"
                    >
                      <span>{c.emoji}</span>
                      <span>
                        {c.label}{" "}
                        {c.diff !== null && (
                          <span className="font-semibold">
                            +{c.diff.toFixed(1)}
                          </span>
                        )}
                      </span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-500">
                  {t("categoryTrend.noImproved")}
                </p>
              )}
            </div>

            <div>
              <p className="text-[11px] font-semibold text-rose-700 mb-1">
                {t("categoryTrend.declinedTitle")}
              </p>
              {trends.declined.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {trends.declined.map((c) => (
                    <span
                      key={c.key}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-100"
                    >
                      <span>{c.emoji}</span>
                      <span>
                        {c.label}{" "}
                        {c.diff !== null && (
                          <span className="font-semibold">
                            {c.diff.toFixed(1)}
                          </span>
                        )}
                      </span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-500">
                  {t("categoryTrend.noDeclined")}
                </p>
              )}
            </div>
          </div>
            );
          })()
        )}
      </div>

      {/* 1on1 成長カード */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-lg shadow-md">
                🎤
              </div>
              <div>
                <p className="text-xs font-semibold text-violet-700 uppercase tracking-wide">
                  {t("oneOnOne.title")}
                </p>
                <p className="text-sm text-slate-600">
                  {t("oneOnOne.subtitle")}
                </p>
              </div>
            </div>
            <Link
              href={latest ? `/result/${latest.id}#interview` : "/"}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-violet-50 text-violet-700 text-xs font-semibold hover:bg-violet-100 transition-colors"
            >
              <span>{t("oneOnOne.ctaDetails")}</span>
              <span>↗</span>
            </Link>
          </div>

          {interviewError && (
            <div className="mt-2">
              <ErrorAlert
                message={interviewError}
                variant="warning"
              />
            </div>
          )}

          {interviewLoading ? (
            <div className="mt-3 space-y-2">
              <div className="skeleton h-10 rounded-xl" />
              <div className="skeleton h-10 rounded-xl" />
            </div>
          ) : !interviewStats ? (
            <p className="mt-2 text-xs text-slate-500">
              {t("oneOnOne.noSessions")}
            </p>
          ) : (
            <div className="mt-3 grid gap-3 md:grid-cols-3 text-xs">
              <div className="rounded-xl bg-slate-50 px-3 py-2.5 flex flex-col gap-1">
                <span className="text-slate-500">
                  {t("oneOnOne.totalTitle")}
                </span>
                <span className="text-xl font-bold text-slate-900">
                  {interviewStats.totalSessions}
                </span>
                <span className="text-[11px] text-slate-500">
                  {t("oneOnOne.totalCaption")}
                </span>
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-2.5 flex flex-col gap-1">
                <span className="text-slate-500">
                  {t("oneOnOne.avgTitle")}
                </span>
                <span className="text-xl font-bold text-emerald-600">
                  {interviewStats.avgScore
                    ? interviewStats.avgScore.toFixed(1)
                    : "-"}
                  <span className="ml-1 text-xs text-slate-500">/ 5.0</span>
                </span>
                <span className="text-[11px] text-slate-500">
                  {t("oneOnOne.avgCaption")}
                </span>
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-2.5 flex flex-col gap-1">
                <span className="text-slate-500">
                  {t("oneOnOne.bestTypeTitle")}
                </span>
                {interviewStats.typeStats.length ? (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {interviewStats.typeStats.map((t) => (
                      <span
                        key={t.key}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white border border-slate-200 text-[11px] text-slate-700"
                      >
                        <span>{t.emoji}</span>
                        <span>
                          {t.label}×{t.count}
                          {t.avgScore && (
                            <span className="ml-1 text-slate-500">
                              ({t.avgScore.toFixed(1)}/5)
                            </span>
                          )}
                        </span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-500 mt-1">
                    {t("oneOnOne.bestTypeEmpty")}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-4 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-1">
              {t("oneOnOne.nextStepTitle")}
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t("oneOnOne.nextStepBody")}
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href={latest ? `/result/${latest.id}#interview` : "/"}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              <span>{t("oneOnOne.ctaPracticeNow")}</span>
            </Link>
            <Link
              href="/admin/usage"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <span>{t("oneOnOne.ctaUsageLog")}</span>
            </Link>
          </div>
        </div>
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
            {t("emptyState.heading")}
          </h3>
          <p className="text-base text-slate-600 mb-2 max-w-md mx-auto leading-relaxed">
            {t("emptyState.body")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8 max-w-md mx-auto">
            <Link
              href="/"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 text-white text-base font-bold shadow-xl shadow-sky-500/30 hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">🚀</span>
              {t("emptyState.ctaDiagnose")}
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-slate-300 bg-white text-slate-700 text-base font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all"
            >
              <span className="text-xl">ℹ️</span>
              {t("emptyState.ctaAbout")}
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg mx-auto text-xs text-slate-600">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-lg">
                ⚡
              </div>
              <span>{t("emptyState.badgeFast")}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-lg">
                🔒
              </div>
              <span>{t("emptyState.badgeSafe")}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-lg">
                💯
              </div>
              <span>{t("emptyState.badgeFree")}</span>
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
                            {t("list.badgeLatest")}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs">
                          <span>📊</span>
                          {t("list.totalLabel")}{" "}
                          <span className="font-semibold text-slate-900">
                            {totalScore}
                          </span>
                        </div>
                        {top && (
                          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-sky-100 to-indigo-100 text-sky-700 text-xs font-medium">
                            <span>{categoryEmojis[top[0]] ?? "⭐"}</span>
                            {t(`categoryLabels.${categoryLabels[top[0]] ?? top[0]}`)}: Lv.{top[1]}
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
                      {t("list.details")}
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
      {isDemo && (
        <DemoGuideBanner
          step={3}
          title={t("demoGuide.title")}
          description={
            <>{t("demoGuide.description")}</>
          }
        />
      )}
    </div>
  );
}
