"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

/**
 * 要素の可視性を追跡するフック
 * 遅延読み込み、アニメーショントリガー、無限スクロールなどに使用
 * 
 * @example
 * const { ref, isVisible } = useIntersectionObserver({
 *   threshold: 0.1,
 *   freezeOnceVisible: true
 * });
 * 
 * return (
 *   <div ref={ref} className={isVisible ? 'animate-in' : 'opacity-0'}>
 *     コンテンツ
 *   </div>
 * );
 */
export function useIntersectionObserver<T extends Element = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
): {
  ref: RefObject<T>;
  isVisible: boolean;
  entry: IntersectionObserverEntry | undefined;
} {
  const {
    threshold = 0,
    root = null,
    rootMargin = "0px",
    freezeOnceVisible = false
  } = options;

  const ref = useRef<T>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const [isVisible, setIsVisible] = useState(false);

  const frozen = freezeOnceVisible && isVisible;

  useEffect(() => {
    const node = ref.current;
    
    if (!node || frozen) {
      return;
    }

    const observerCallback: IntersectionObserverCallback = ([entry]) => {
      if (entry) {
        setEntry(entry);
        setIsVisible(entry.isIntersecting);
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold,
      root,
      rootMargin
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, frozen]);

  return { ref, isVisible, entry };
}









