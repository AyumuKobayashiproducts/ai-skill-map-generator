"use client";

import { useEffect } from "react";

/**
 * シンプルな Service Worker 登録コンポーネント
 * - Android Chrome などで PWA としてインストール可能にするための最小構成
 */
export function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((error) => {
          // PWA の失敗は致命的ではないので console にだけ出す
          console.error("Service worker registration failed", error);
        });
    };

    // ページロード完了後に登録
    if (document.readyState === "complete") {
      register();
      return;
    }

    // それ以外の場合は load イベントで登録し、クリーンアップ関数を返す
    window.addEventListener("load", register);
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}



