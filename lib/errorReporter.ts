/**
 * エラートラッキング用の薄いラッパー。
 *
 * 現状は console.error によるログ出力のみだが、
 * 本番運用では Sentry / Datadog / New Relic などの
 * エラートラッキングサービスに差し替える想定。
 *
 * 例:
 *   import { reportError } from "@/lib/errorReporter";
 *   try {
 *     // ...
 *   } catch (error) {
 *     reportError(error, { feature: "skill-map-generate" });
 *   }
 */

type ErrorContext = Record<string, unknown>;

export function reportError(error: unknown, context?: ErrorContext): void {
  const normalizedError =
    error instanceof Error ? error : new Error(String(error));

  // 現状はコンソール出力のみ（ポートフォリオ用途）
  // 実運用ではここで Sentry.captureException などに差し替える。
  // eslint-disable-next-line no-console
  console.error("[ErrorReporter]", normalizedError, context);
}





