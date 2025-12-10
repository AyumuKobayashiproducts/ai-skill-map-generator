import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("初期値をすぐに返す", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));
    expect(result.current).toBe("initial");
  });

  it("指定した遅延後に値が更新される", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } }
    );

    // 値を更新
    rerender({ value: "updated", delay: 500 });

    // まだ更新されていない
    expect(result.current).toBe("initial");

    // 時間を進める
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // 更新されている
    expect(result.current).toBe("updated");
  });

  it("連続した更新で最後の値のみが反映される", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } }
    );

    // 連続して値を更新
    rerender({ value: "update1", delay: 500 });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender({ value: "update2", delay: 500 });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender({ value: "update3", delay: 500 });

    // まだ初期値
    expect(result.current).toBe("initial");

    // 最後の更新から500ms経過
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // 最後の値が反映
    expect(result.current).toBe("update3");
  });

  it("数値型でも動作する", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 0, delay: 300 } }
    );

    rerender({ value: 42, delay: 300 });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe(42);
  });

  it("オブジェクト型でも動作する", () => {
    const initialObj = { name: "initial" };
    const updatedObj = { name: "updated" };

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: initialObj, delay: 300 } }
    );

    rerender({ value: updatedObj, delay: 300 });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe(updatedObj);
  });
});











