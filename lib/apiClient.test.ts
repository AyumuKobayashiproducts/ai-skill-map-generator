import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { postJson, getJson } from "./apiClient";

describe("apiClient", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe("postJson", () => {
    it("正常なレスポンスを返す", async () => {
      const mockResponse = { id: "123", name: "test" };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await postJson<{ input: string }, { id: string; name: string }>(
        "/api/test",
        { input: "test" }
      );

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith("/api/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: "test" })
      });
    });

    it("APIエラー時にエラーをスローする", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: "Bad Request" })
      });

      await expect(postJson("/api/test", {})).rejects.toThrow("Bad Request");
    });

    it("ネットワークエラー時にエラーをスローする", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

      await expect(postJson("/api/test", {})).rejects.toThrow("Network error");
    });
  });

  describe("getJson", () => {
    it("正常なレスポンスを返す", async () => {
      const mockResponse = { items: [1, 2, 3] };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await getJson<{ items: number[] }>("/api/items");

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith("/api/items", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
    });

    it("APIエラー時にエラーをスローする", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: "Not Found" })
      });

      await expect(getJson("/api/items")).rejects.toThrow("Not Found");
    });
  });
});











