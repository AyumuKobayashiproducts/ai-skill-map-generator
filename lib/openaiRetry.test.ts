import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/lib/openaiClient", () => ({
  createOpenAIClient: vi.fn()
}));

vi.mock("@/lib/usageServerLogger", () => ({
  logUsageServer: vi.fn()
}));

import { safeChatCompletion } from "./openaiRetry";
import { createOpenAIClient } from "@/lib/openaiClient";
import { logUsageServer } from "@/lib/usageServerLogger";

type MockedFn<T extends (...args: any[]) => any> = ReturnType<typeof vi.fn<T>>;

describe("safeChatCompletion", () => {
  let mockCreateClient: MockedFn<() => any>;
  let mockLogUsageServer: MockedFn<(event: string, meta?: Record<string, unknown>) => Promise<void> | void>;

  beforeEach(() => {
    vi.resetAllMocks();
    mockCreateClient = createOpenAIClient as unknown as MockedFn<() => any>;
    mockLogUsageServer = logUsageServer as unknown as MockedFn<
      (event: string, meta?: Record<string, unknown>) => Promise<void> | void
    >;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const baseParams = {
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: "test" }]
  };

  it("最初の試行で成功した場合に結果を返し、success ログを記録する", async () => {
    const fakeCompletion = {
      id: "cmpl_test"
    };

    const createMock = vi.fn().mockResolvedValue(fakeCompletion);

    mockCreateClient.mockReturnValue({
      chat: {
        completions: {
          create: createMock
        }
      }
    } as unknown as any);

    const result = await safeChatCompletion({
      feature: "unit_test_success",
      params: baseParams,
      maxRetries: 1,
      timeoutMs: 1000
    });

    expect(result).toBe(fakeCompletion);
    expect(createMock).toHaveBeenCalledTimes(1);
    expect(createMock).toHaveBeenCalledWith(baseParams, { timeout: 1000 });

    expect(mockLogUsageServer).toHaveBeenCalledWith(
      "openai_chat_success",
      expect.objectContaining({
        feature: "unit_test_success",
        model: baseParams.model,
        durationMs: expect.any(Number)
      })
    );

    // error ログは呼ばれていないこと
    expect(
      mockLogUsageServer.mock.calls.find(([event]) => event === "openai_chat_error")
    ).toBeUndefined();
  });

  it("失敗後にリトライして成功した場合、error → success の両方を記録する", async () => {
    vi.useFakeTimers();

    const fakeCompletion = {
      id: "cmpl_retry"
    };

    const error = new Error("temporary error");

    const createMock = vi.fn().mockRejectedValueOnce(error).mockResolvedValueOnce(fakeCompletion);

    mockCreateClient.mockReturnValue({
      chat: {
        completions: {
          create: createMock
        }
      }
    } as unknown as any);

    const promise = safeChatCompletion({
      feature: "unit_test_retry",
      params: baseParams,
      maxRetries: 1,
      timeoutMs: 1000
    });

    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result).toBe(fakeCompletion);
    expect(createMock).toHaveBeenCalledTimes(2);

    // 1回目の失敗で error ログが記録される
    expect(mockLogUsageServer).toHaveBeenCalledWith(
      "openai_chat_error",
      expect.objectContaining({
        feature: "unit_test_retry",
        model: baseParams.model,
        attempt: 0,
        message: "temporary error"
      })
    );

    // 2回目の成功で success ログが記録される
    expect(
      mockLogUsageServer.mock.calls.find(([event]) => event === "openai_chat_success")
    ).toBeTruthy();
  });

  it("全ての試行が失敗した場合、最後のエラーを投げる", async () => {
    const error = new Error("final error");

    const createMock = vi.fn().mockRejectedValue(error);

    mockCreateClient.mockReturnValue({
      chat: {
        completions: {
          create: createMock
        }
      }
    } as unknown as any);

    await expect(
      safeChatCompletion({
        feature: "unit_test_fail",
        params: baseParams,
        maxRetries: 1,
        timeoutMs: 1000
      })
    ).rejects.toThrow("final error");

    // 少なくとも1回は error ログが記録されている
    expect(
      mockLogUsageServer.mock.calls.find(([event]) => event === "openai_chat_error")
    ).toBeTruthy();
  });
});

