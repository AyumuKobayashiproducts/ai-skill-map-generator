import type OpenAI from "openai";
import { createOpenAIClient } from "@/lib/openaiClient";
import { logUsageServer } from "@/lib/usageServerLogger";

// OpenAI ライブラリの型定義に過度に依存しないよう、
// このラッパーで必要な最小限のパラメータのみを型として定義しておく。
// 実際には Chat Completions API にそのまま渡されるオブジェクトを想定。
type ChatCompletionParams = {
  model: string;
  // Chat Completions API で必須となる messages フィールドだけは型として保持
  messages: unknown;
  [key: string]: unknown;
};

interface SafeChatOptions {
  feature: string;
  params: ChatCompletionParams;
  maxRetries?: number;
  timeoutMs?: number;
}

// OpenAI Chat Completions 向けの共通ラッパー
// - タイムアウト付き
// - リトライ（指数バックオフ）
// - usage_logs への簡易メトリクス記録
export async function safeChatCompletion({
  feature,
  params,
  maxRetries = 1,
  timeoutMs = 20000
}: SafeChatOptions): Promise<OpenAI.Chat.Completions.ChatCompletion> {
  const openai = createOpenAIClient();
  const startedAt = Date.now();

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const completion = await openai.chat.completions.create(
        params as any,
        {
          timeout: timeoutMs
        }
      );

      const durationMs = Date.now() - startedAt;
      void logUsageServer("openai_chat_success", {
        feature,
        model: params.model,
        durationMs
      });

      return completion;
    } catch (error) {
      lastError = error;
      const durationMs = Date.now() - startedAt;
      void logUsageServer("openai_chat_error", {
        feature,
        model: params.model,
        attempt,
        durationMs,
        message: error instanceof Error ? error.message : String(error)
      });

      if (attempt >= maxRetries) {
        break;
      }

      // 簡易バックオフ（500ms, 1000ms, ...）
      const backoffMs = 500 * (attempt + 1);
      await new Promise((resolve) => setTimeout(resolve, backoffMs));
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("OpenAI chat completion failed");
}


