"use client";

import { useCallback, useState } from "react";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseAsyncActionReturn<T, P extends unknown[]> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...params: P) => Promise<T | null>;
  reset: () => void;
}

/**
 * 非同期アクションを管理するカスタムフック
 * ローディング状態、エラー状態、データを一元管理
 * 
 * @example
 * const { data, loading, error, execute } = useAsyncAction(async (id: string) => {
 *   const response = await fetch(`/api/items/${id}`);
 *   return response.json();
 * });
 */
export function useAsyncAction<T, P extends unknown[] = []>(
  asyncFn: (...params: P) => Promise<T>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    errorMessage?: string;
  }
): UseAsyncActionReturn<T, P> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const execute = useCallback(
    async (...params: P): Promise<T | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      
      try {
        const result = await asyncFn(...params);
        setState({ data: result, loading: false, error: null });
        options?.onSuccess?.(result);
        return result;
      } catch (e) {
        const errorMessage =
          options?.errorMessage ??
          (e instanceof Error ? e.message : "エラーが発生しました");
        
        setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
        options?.onError?.(e instanceof Error ? e : new Error(errorMessage));
        return null;
      }
    },
    [asyncFn, options]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    execute,
    reset
  };
}









