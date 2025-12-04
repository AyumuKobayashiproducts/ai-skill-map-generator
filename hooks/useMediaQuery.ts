"use client";

import { useEffect, useState } from "react";

/**
 * メディアクエリの状態を追跡するフック
 * レスポンシブデザインでのJS側の条件分岐に使用
 * 
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // SSR対応: サーバーサイドではwindowが存在しない
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    
    // 初期値を設定
    setMatches(mediaQuery.matches);

    // 変更を監視
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener("change", handler);

    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  }, [query]);

  return matches;
}

/**
 * よく使うブレイクポイントのプリセット
 */
export function useBreakpoint() {
  const isMobile = useMediaQuery("(max-width: 639px)");
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isLargeDesktop = useMediaQuery("(min-width: 1280px)");

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    // 便利なエイリアス
    isTouchDevice: isMobile || isTablet,
    isWideScreen: isDesktop || isLargeDesktop
  };
}


