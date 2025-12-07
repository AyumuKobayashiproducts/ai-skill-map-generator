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

  // OpenAI 関連メトリクス
  const totalOpenAISuccess = totalByEvent.get("openai_chat_success") ?? 0;
  const totalOpenAIError = totalByEvent.get("openai_chat_error") ?? 0;
  const totalOpenAIRequests = totalOpenAISuccess + totalOpenAIError;
  const openAIErrorRate =
    totalOpenAIRequests > 0
      ? Math.round((totalOpenAIError / totalOpenAIRequests) * 100)
      : null;

  const totalGenerateSuccess = totalByEvent.get("generate_skill_map_success") ?? 0;
  const totalGenerateError = totalByEvent.get("generate_skill_map_error") ?? 0;
  const totalGenerateRequests = totalGenerateSuccess + totalGenerateError;
  const generateErrorRate =
    totalGenerateRequests > 0
      ? Math.round((totalGenerateError / totalGenerateRequests) * 100)
      : null;

  // その他主要 AI 機能のざっくり成功率
  const buildSuccessMetric = (successKey: string, errorKey: string) => {
    const success = totalByEvent.get(successKey) ?? 0;
    const error = totalByEvent.get(errorKey) ?? 0;
    const total = success + error;
    return {
      success,
      error,
      total,
      rate: total > 0 ? Math.round((success / total) * 100) : null
    };
  };

  const jobMatchMetric = buildSuccessMetric("job_match_success", "job_match_error");
  const riskMetric = buildSuccessMetric("risk_success", "risk_error");
  const todayTaskMetric = buildSuccessMetric(
    "today_task_success",
    "today_task_error"
  );
  const timeSimulateMetric = buildSuccessMetric(
    "time_simulate_success",
    "time_simulate_error"
  );
  const portfolioMetric = buildSuccessMetric(
    "portfolio_success",
    "portfolio_error"
  );
  const coachMetric = buildSuccessMetric("coach_success", "coach_error");
  const oneOnOneSummaryMetric = buildSuccessMetric(
    "oneonone_summary_success",
    "oneonone_summary_error"
  );

  // KPI 用のざっくり集計
  const totalEvents = rows.length;
  const totalGenerate = totalByEvent.get("generate_skill_map_clicked") ?? 0;
  const totalJobMatch = totalByEvent.get("job_match_clicked") ?? 0;
  const totalOneOnOne = totalByEvent.get("oneonone_session_saved") ?? 0;

  // 直近7日間の合計（診断 / JobMatch / 1on1）
  let sevenDaysGenerate = 0;
  let sevenDaysJobMatch = 0;
  let sevenDaysOneOnOne = 0;

  for (const [, eventMap] of byDayAndEvent.entries()) {
    sevenDaysGenerate += eventMap.get("generate_skill_map_clicked") ?? 0;
    sevenDaysJobMatch += eventMap.get("job_match_clicked") ?? 0;
    sevenDaysOneOnOne += eventMap.get("oneonone_session_saved") ?? 0;
  }

  const funnelJobMatch =
    totalGenerate > 0 ? Math.round((totalJobMatch / totalGenerate) * 100) : null;
  const funnelOneOnOne =
    totalGenerate > 0 ? Math.round((totalOneOnOne / totalGenerate) * 100) : null;

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

      {/* KPI サマリーカード */}
      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs text-slate-500 mb-1">総イベント数</p>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">
            {totalEvents}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            usage_logs に記録されている全イベント数です。
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 shadow-sm">
          <p className="text-xs font-semibold text-emerald-700 mb-1">
            診断実行（/7日）
          </p>
          <p className="text-xl font-bold text-emerald-900 tabular-nums">
            {sevenDaysGenerate}{" "}
            <span className="ml-1 text-xs text-emerald-700">
              / {totalGenerate}
            </span>
          </p>
          <p className="mt-1 text-[11px] text-emerald-800/80">
            generate_skill_map_clicked の件数です。直近7日間と全期間の両方を表示しています。
          </p>
        </div>
        <div className="rounded-2xl border border-sky-200 bg-sky-50/70 px-4 py-3 shadow-sm">
          <p className="text-xs font-semibold text-sky-700 mb-1">
            求人マッチ（/7日）
          </p>
          <p className="text-xl font-bold text-sky-900 tabular-nums">
            {sevenDaysJobMatch}{" "}
            <span className="ml-1 text-xs text-sky-700">
              / {totalJobMatch}
            </span>
          </p>
          <p className="mt-1 text-[11px] text-sky-800/80">
            job_match_clicked の件数です。どれだけ求人比較まで進んでいるかの目安になります。
          </p>
        </div>
        <div className="rounded-2xl border border-violet-200 bg-violet-50/70 px-4 py-3 shadow-sm">
          <p className="text-xs font-semibold text-violet-700 mb-1">
            1on1 セッション（/7日）
          </p>
          <p className="text-xl font-bold text-violet-900 tabular-nums">
            {sevenDaysOneOnOne}{" "}
            <span className="ml-1 text-xs text-violet-700">
              / {totalOneOnOne}
            </span>
          </p>
          <p className="mt-1 text-[11px] text-violet-800/80">
            oneonone_session_saved の件数です。診断から面接練習まで到達している回数を示します。
          </p>
        </div>
        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 px-4 py-3 shadow-sm md:col-span-2">
          <p className="text-xs font-semibold text-rose-700 mb-1">
            OpenAI エラー率（全機能合計）
          </p>
          <p className="text-xl font-bold text-rose-900 tabular-nums">
            {openAIErrorRate !== null ? `${openAIErrorRate}%` : "-"}
            <span className="ml-2 text-xs text-rose-800">
              （{totalOpenAIError} / {totalOpenAIRequests}）
            </span>
          </p>
          <p className="mt-1 text-[11px] text-rose-800/80">
            openai_chat_success / openai_chat_error イベントから算出した、おおまかな OpenAI API
            のエラー率です。モデル変更やプロンプト調整のインパクトを見るときの指標になります。
          </p>
        </div>
      </section>

      {/* 診断の成功率 */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">診断 API の成功率</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          /api/generate の成功・エラーを usage_logs の{" "}
          <code>generate_skill_map_success</code> /{" "}
          <code>generate_skill_map_error</code>{" "}
          から集計したものです。簡易的な指標ですが、本番障害に気づくためのフラグとして使えます。
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-semibold text-slate-700 mb-1">
              診断 API 成功率
            </p>
            <p className="text-2xl font-bold text-slate-900 tabular-nums">
              {generateErrorRate !== null
                ? `${100 - generateErrorRate}%`
                : "-"}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              成功 {totalGenerateSuccess} 件 / 失敗 {totalGenerateError} 件 （合計{" "}
              {totalGenerateRequests} 件）から算出。
            </p>
          </div>
        </div>
      </section>

      {/* 主要な AI 機能の成功率 */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">主要な AI 機能の成功率（ざっくり）</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          API 単位で <code>xxx_success</code> / <code>xxx_error</code> を emit しているものだけを対象に、
          成功率をざっくり可視化しています。本番運用なら期間条件や閾値アラートなどを追加する想定です。
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-semibold text-slate-700 mb-1">
              求人マッチ API
            </p>
            <p className="text-xl font-bold text-slate-900 tabular-nums">
              {jobMatchMetric.rate !== null ? `${jobMatchMetric.rate}%` : "-"}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              成功 {jobMatchMetric.success} / 失敗 {jobMatchMetric.error} （合計{" "}
              {jobMatchMetric.total}）
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-semibold text-slate-700 mb-1">
              キャリアリスク API
            </p>
            <p className="text-xl font-bold text-slate-900 tabular-nums">
              {riskMetric.rate !== null ? `${riskMetric.rate}%` : "-"}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              成功 {riskMetric.success} / 失敗 {riskMetric.error} （合計{" "}
              {riskMetric.total}）
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-semibold text-slate-700 mb-1">
              今日のタスク API
            </p>
            <p className="text-xl font-bold text-slate-900 tabular-nums">
              {todayTaskMetric.rate !== null ? `${todayTaskMetric.rate}%` : "-"}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              成功 {todayTaskMetric.success} / 失敗 {todayTaskMetric.error} （合計{" "}
              {todayTaskMetric.total}）
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-semibold text-slate-700 mb-1">
              学習時間シミュレーター API
            </p>
            <p className="text-xl font-bold text-slate-900 tabular-nums">
              {timeSimulateMetric.rate !== null
                ? `${timeSimulateMetric.rate}%`
                : "-"}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              成功 {timeSimulateMetric.success} / 失敗 {timeSimulateMetric.error} （合計{" "}
              {timeSimulateMetric.total}）
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-semibold text-slate-700 mb-1">
              ポートフォリオ生成 API
            </p>
            <p className="text-xl font-bold text-slate-900 tabular-nums">
              {portfolioMetric.rate !== null ? `${portfolioMetric.rate}%` : "-"}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              成功 {portfolioMetric.success} / 失敗 {portfolioMetric.error} （合計{" "}
              {portfolioMetric.total}）
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-semibold text-slate-700 mb-1">
              1on1 総評 API
            </p>
            <p className="text-xl font-bold text-slate-900 tabular-nums">
              {oneOnOneSummaryMetric.rate !== null
                ? `${oneOnOneSummaryMetric.rate}%`
                : "-"}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              成功 {oneOnOneSummaryMetric.success} / 失敗{" "}
              {oneOnOneSummaryMetric.error} （合計 {oneOnOneSummaryMetric.total}）
            </p>
          </div>
        </div>
      </section>

      {/* 簡易ファネル */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">簡易ファネル（診断 → JobMatch / 1on1）</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          「スキルマップ診断を実行したユーザーのうち、どれくらいが求人マッチ / 1on1 練習まで到達しているか」をざっくり把握するための指標です。
          現状は全期間ベースの集計ですが、必要に応じて期間別に切り出す想定です。
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-semibold text-slate-700 mb-1">
              診断 → 求人マッチング 到達率
            </p>
            <p className="text-2xl font-bold text-slate-900 tabular-nums">
              {funnelJobMatch !== null ? `${funnelJobMatch}%` : "-"}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              （{totalGenerate} 回の診断のうち {totalJobMatch} 回が{" "}
              <code>job_match_clicked</code> まで進んだ割合）
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-semibold text-slate-700 mb-1">
              診断 → 1on1 セッション保存 到達率
            </p>
            <p className="text-2xl font-bold text-slate-900 tabular-nums">
              {funnelOneOnOne !== null ? `${funnelOneOnOne}%` : "-"}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              （{totalGenerate} 回の診断のうち {totalOneOnOne} 回が{" "}
              <code>oneonone_session_saved</code> まで進んだ割合）
            </p>
          </div>
        </div>
      </section>

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


