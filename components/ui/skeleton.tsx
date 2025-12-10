import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

/**
 * スケルトンローディングコンポーネント
 * コンテンツ読み込み中のプレースホルダーとして使用
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-slate-200/80",
        className
      )}
      aria-hidden="true"
    />
  );
}

/**
 * テキスト用スケルトン
 */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  );
}

/**
 * カード用スケルトン
 */
export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white p-4 space-y-3", className)}>
      <Skeleton className="h-5 w-1/3" />
      <SkeletonText lines={2} />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

/**
 * アバター用スケルトン
 */
export function SkeletonAvatar({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  };

  return <Skeleton className={cn("rounded-full", sizeClasses[size])} />;
}

/**
 * チャート用スケルトン
 */
export function SkeletonChart({ className }: SkeletonProps) {
  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <Skeleton className="h-48 w-48 rounded-full" />
    </div>
  );
}

/**
 * リストアイテム用スケルトン
 */
export function SkeletonListItem() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-slate-100 last:border-0">
      <SkeletonAvatar />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  );
}

/**
 * ダッシュボード用スケルトン
 */
export function SkeletonDashboard() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonListItem key={i} />
        ))}
      </div>
    </div>
  );
}

/**
 * 結果ページ用スケルトン
 */
export function SkeletonResult() {
  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-lg" />
        ))}
      </div>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonChart />
    </div>
  );
}











