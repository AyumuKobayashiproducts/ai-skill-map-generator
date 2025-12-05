import { describe, it, expect } from "vitest";
import { cn, clamp, formatDate, truncate } from "./utils";

describe("utils", () => {
  describe("cn (className merger)", () => {
    it("複数のクラス名をマージする", () => {
      const result = cn("text-red-500", "bg-blue-500");
      expect(result).toContain("text-red-500");
      expect(result).toContain("bg-blue-500");
    });

    it("条件付きクラス名を処理する", () => {
      const result = cn("base", true && "included", false && "excluded");
      expect(result).toContain("base");
      expect(result).toContain("included");
      expect(result).not.toContain("excluded");
    });

    it("重複するTailwindクラスを解決する", () => {
      const result = cn("text-red-500", "text-blue-500");
      // 最後のクラスが優先される
      expect(result).toContain("text-blue-500");
    });
  });

  describe("clamp", () => {
    it("範囲内の値をそのまま返す", () => {
      expect(clamp(50, 0, 100)).toBe(50);
    });

    it("最小値より小さい場合は最小値を返す", () => {
      expect(clamp(-10, 0, 100)).toBe(0);
    });

    it("最大値より大きい場合は最大値を返す", () => {
      expect(clamp(150, 0, 100)).toBe(100);
    });
  });

  describe("formatDate", () => {
    it("日付を日本語フォーマットで返す", () => {
      const date = new Date("2024-01-15T10:30:00");
      const result = formatDate(date);
      expect(result).toMatch(/2024/);
      expect(result).toMatch(/01/);
      expect(result).toMatch(/15/);
    });
  });

  describe("truncate", () => {
    it("指定した長さで文字列を切り詰める", () => {
      const result = truncate("これは長いテキストです", 5);
      expect(result).toBe("これは長い...");
    });

    it("短い文字列はそのまま返す", () => {
      const result = truncate("短い", 10);
      expect(result).toBe("短い");
    });
  });
});



