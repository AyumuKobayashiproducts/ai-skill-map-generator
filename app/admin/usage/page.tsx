"use server";

import { createSupabaseClient } from "@/lib/supabaseClient";

type UsageRow = {
  event: string | null;
  created_at: string | null;
};

export default async function UsageAdminPage() {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("usage_logs")
    .select("event, created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-10 space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">
          Usage Logs ダッシュボード（開発用）
        </h1>
        <p className="text-sm text-red-600">
          ログの取得に失敗しました: {error.message}
        </p>
      </div>
    );
  }

  const rows: UsageRow[] = data ?? [];

  // イベント別カウント集計
  const totalByEvent = new Map<string, number>();

  // 直近 7 日間の日別 × イベント別カウント
  const byDayAndEvent = new Map<string, Map<string, number>>();
  const now = new Date();
  const sevenDaysAgo = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 6
  );

  for (const row of rows) {
    const event = row.event ?? "unknown";
    totalByEvent.set(event, (totalByEvent.get(event) ?? 0) + 1);

    if (!row.created_at) continue;
    const createdAt = new Date(row.created_at);
    const dayKey = row.created_at.slice(0, 10); // YYYY-MM-DD

    if (createdAt >= sevenDaysAgo) {
      if (!byDayAndEvent.has(dayKey)) {
        byDayAndEvent.set(dayKey, new Map());
      }
      const inner = byDayAndEvent.get(dayKey)!;
      inner.set(event, (inner.get(event) ?? 0) + 1);
    }
  }

  const totalRows = Array.from(totalByEvent.entries()).sort(
    (a, b) => b[1] - a[1]
  );

  const dayKeys = Array.from(byDayAndEvent.keys()).sort(); // 昇順

  const eventSet = new Set<string>();
  for (const [, eventMap] of byDayAndEvent.entries()) {
    for (const ev of eventMap.keys()) {
      eventSet.add(ev);
    }
  }
  const eventList = Array.from(eventSet);

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Usage Logs ダッシュボード（開発用）
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          このページはポートフォリオ・開発用の簡易管理画面です。
          <br />
          Supabase の <code>usage_logs</code>{" "}
          テーブルからデータを取得し、機能ごとの利用状況と直近 7 日間の推移をざっくり可視化しています。
        </p>
        <p className="text-xs text-muted-foreground">
          ※ 本番運用する場合は、認証や RLS でアクセス制限を掛ける想定です。
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">イベント別累計カウント</h2>
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-slate-700">
                  イベント名
                </th>
                <th className="px-4 py-2 text-right font-semibold text-slate-700">
                  回数
                </th>
              </tr>
            </thead>
            <tbody>
              {totalRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    className="px-4 py-6 text-center text-sm text-muted-foreground"
                  >
                    まだ usage_logs のデータがありません。
                    <br />
                    例: <code>page_home_view</code>,{" "}
                    <code>generate_skill_map_clicked</code>,{" "}
                    <code>job_match_run</code> などのイベントがここに貯まります。
                  </td>
                </tr>
              ) : (
                totalRows.map(([event, count]) => (
                  <tr key={event} className="border-t">
                    <td className="px-4 py-1.5 text-xs font-medium text-slate-800">
                      {event}
                    </td>
                    <td className="px-4 py-1.5 text-xs text-right tabular-nums">
                      {count}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">直近 7 日間のイベント別カウント</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          行が日付、列がイベント名です。軽量なテーブル形式で、ざっくりと利用の偏りを確認できます。
        </p>
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-slate-700">
                  日付
                </th>
                {eventList.map((ev) => (
                  <th
                    key={ev}
                    className="px-3 py-2 text-right font-semibold text-slate-700"
                  >
                    {ev}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dayKeys.length === 0 ? (
                <tr>
                  <td
                    colSpan={1 + eventList.length}
                    className="px-4 py-6 text-center text-sm text-muted-foreground"
                  >
                    直近 7 日間のデータがありません。
                    <br />
                    ホーム画面の表示や診断実行などの操作が増えると、ここに日別のカウントが並びます。
                  </td>
                </tr>
              ) : (
                dayKeys.map((day) => {
                  const eventMap = byDayAndEvent.get(day);
                  return (
                    <tr key={day} className="border-t">
                      <td className="px-4 py-1.5 text-xs font-medium text-slate-800">
                        {day}
                      </td>
                      {eventList.map((ev) => {
                        const value = eventMap?.get(ev) ?? 0;
                        return (
                          <td
                            key={ev}
                            className="px-3 py-1.5 text-right tabular-nums text-slate-800"
                          >
                            {value === 0 ? "-" : value}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">直近のイベント一覧（最新 50 件）</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          いつ・どのイベントが発生したかをざっと確認するためのテーブルです。meta カラムには、必要に応じてページやIDなどの追加情報を載せられます（実運用では PII を含めない前提）。
        </p>
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-slate-700">
                  発生日時
                </th>
                <th className="px-4 py-2 text-left font-semibold text-slate-700">
                  イベント名
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    className="px-4 py-6 text-center text-sm text-muted-foreground"
                  >
                    まだ usage_logs のデータがありません。
                    <br />
                    画面遷移やボタンクリック時に <code>logUsage()</code> を呼び出すと、ここに最新 50 件が時系列で表示されます。
                  </td>
                </tr>
              ) : (
                rows.slice(0, 50).map((row, idx) => {
                  const createdAt = row.created_at
                    ? new Date(row.created_at)
                    : null;
                  return (
                    <tr key={`${row.created_at}-${row.event}-${idx}`} className="border-t">
                      <td className="px-4 py-1.5 text-xs text-slate-800 tabular-nums">
                        {createdAt
                          ? createdAt.toLocaleString("ja-JP", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit"
                            })
                          : "-"}
                      </td>
                      <td className="px-4 py-1.5 text-xs font-medium text-slate-900">
                        {row.event ?? "unknown"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}


