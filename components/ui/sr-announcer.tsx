"use client";

import { useEffect, useRef, useState } from "react";

interface SrAnnouncerProps {
  message: string;
  politeness?: "polite" | "assertive";
}

/**
 * スクリーンリーダーへの動的なアナウンスを行うコンポーネント
 * フォーム送信完了、エラー発生時などの通知に使用
 * 
 * @example
 * const [announcement, setAnnouncement] = useState('');
 * 
 * const handleSubmit = async () => {
 *   await submitForm();
 *   setAnnouncement('フォームが送信されました');
 * };
 * 
 * return (
 *   <>
 *     <SrAnnouncer message={announcement} />
 *     <form onSubmit={handleSubmit}>...</form>
 *   </>
 * );
 */
export function SrAnnouncer({ message, politeness = "polite" }: SrAnnouncerProps) {
  const [announcement, setAnnouncement] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (message) {
      // 一度空にしてから設定することで、同じメッセージでも再度読み上げられる
      setAnnouncement("");
      
      timeoutRef.current = setTimeout(() => {
        setAnnouncement(message);
      }, 100);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [message]);

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
}

/**
 * グローバルなアナウンサーフック
 * アプリ全体で使用可能な通知システム
 */
let globalAnnounce: (message: string, politeness?: "polite" | "assertive") => void = () => {};

export function setGlobalAnnounce(fn: typeof globalAnnounce) {
  globalAnnounce = fn;
}

export function announce(message: string, politeness?: "polite" | "assertive") {
  globalAnnounce(message, politeness);
}

/**
 * グローバルアナウンサーのプロバイダー
 * レイアウトの最上位に配置
 */
export function GlobalSrAnnouncer() {
  const [state, setState] = useState<{ message: string; politeness: "polite" | "assertive" }>({
    message: "",
    politeness: "polite"
  });

  useEffect(() => {
    setGlobalAnnounce((message, politeness = "polite") => {
      setState({ message, politeness });
    });
  }, []);

  return <SrAnnouncer message={state.message} politeness={state.politeness} />;
}

