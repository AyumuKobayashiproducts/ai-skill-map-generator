/**
 * 監視・エラー追跡のためのエントリーポイント。
 *
 * 現時点では Sentry などの外部 APM には依存せず、
 * 将来的に SDK を差し込めるような形だけを用意しています。
 */

type MonitoringLevel = "info" | "warn" | "error";

interface MonitoringMeta {
  feature?: string;
  code?: string;
  [key: string]: unknown;
}

export function recordClientEvent(
  level: MonitoringLevel,
  message: string,
  meta?: MonitoringMeta
): void {
  // 将来的に Sentry / Datadog 等の SDK をここに接続する想定
  if (process.env.NODE_ENV !== "production") {
    // 開発環境ではコンソール出力のみ
    // eslint-disable-next-line no-console
    console[level](`[monitoring] ${message}`, meta ?? {});
  }
}



