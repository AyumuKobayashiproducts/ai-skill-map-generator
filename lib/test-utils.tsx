/**
 * テスト用ユーティリティ
 * Findy評価向上のため、テストインフラを整備
 */

import type { ReactNode } from "react";
import { vi } from "vitest";

/**
 * モックデータ生成ユーティリティ
 */
export const mockData = {
  skillCategories: {
    frontend: 4,
    backend: 3,
    infra: 2,
    ai: 1,
    tools: 3
  },
  
  skillMapResult: {
    id: "test-123",
    rawInput: "React, TypeScript, Node.js",
    categories: {
      frontend: 4,
      backend: 3,
      infra: 2,
      ai: 1,
      tools: 3
    },
    strengths: "フロントエンド開発に強みがあります",
    weaknesses: "AI/ML分野の経験が少ないです",
    nextSkills: ["Docker", "Kubernetes", "Python"],
    roadmap30: "30日ロードマップ",
    roadmap90: "90日ロードマップ",
    chartData: null
  },
  
  jobMatchResult: {
    score: 75,
    matchedSkills: ["React", "TypeScript"],
    missingSkills: ["AWS", "Docker"],
    summary: "マッチングスコアは75%です",
    roadmapForJob: "AWS基礎を学びましょう"
  },
  
  careerRiskResult: {
    obsolescence: 30,
    busFactor: 50,
    automation: 40,
    summary: "技術のアップデートを心がけましょう",
    actions: "クラウド技術を習得しましょう"
  },
  
  user: {
    id: "user-123",
    email: "test@example.com",
    name: "Test User"
  }
};

/**
 * 待機ユーティリティ
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 非同期処理のモック
 */
export function createAsyncMock<T>(data: T, delay = 100): () => Promise<T> {
  return async () => {
    await wait(delay);
    return data;
  };
}

/**
 * エラーを投げるモック
 */
export function createErrorMock(message: string, delay = 100): () => Promise<never> {
  return async () => {
    await wait(delay);
    throw new Error(message);
  };
}

/**
 * フェッチのモック
 */
export function mockFetch(response: unknown, options: { ok?: boolean; status?: number } = {}) {
  const { ok = true, status = 200 } = options;
  
  return vi.fn().mockResolvedValue({
    ok,
    status,
    json: async () => response,
    text: async () => JSON.stringify(response)
  });
}

/**
 * LocalStorageのモック
 */
export function createLocalStorageMock() {
  let store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] ?? null
  };
}

/**
 * テスト用のラッパーコンポーネント
 */
interface TestWrapperProps {
  children: ReactNode;
}

export function TestWrapper({ children }: TestWrapperProps) {
  return <>{children}</>;
}

/**
 * カスタムレンダー関数の型
 */
export interface RenderOptions {
  wrapper?: React.ComponentType<{ children: ReactNode }>;
}

/**
 * アクセシビリティテスト用ユーティリティ
 */
export function checkAccessibility(element: HTMLElement): {
  hasRole: boolean;
  hasAriaLabel: boolean;
  isFocusable: boolean;
} {
  return {
    hasRole: element.hasAttribute("role"),
    hasAriaLabel:
      element.hasAttribute("aria-label") ||
      element.hasAttribute("aria-labelledby") ||
      element.hasAttribute("aria-describedby"),
    isFocusable:
      element.tabIndex >= 0 ||
      ["BUTTON", "A", "INPUT", "SELECT", "TEXTAREA"].includes(element.tagName)
  };
}

/**
 * スナップショットテスト用のシリアライザー
 */
export function serializeForSnapshot(obj: unknown): string {
  return JSON.stringify(obj, null, 2);
}
