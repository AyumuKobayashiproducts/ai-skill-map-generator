import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

/**
 * グローバルローディング状態
 * ページ遷移時に自動で表示される
 */
export default function Loading() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header skeleton */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="space-y-4">
        <SkeletonText lines={4} />
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
            <Skeleton className="h-5 w-1/3" />
            <SkeletonText lines={2} />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
            <Skeleton className="h-5 w-1/3" />
            <SkeletonText lines={2} />
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <div className="w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <span>読み込み中...</span>
        </div>
      </div>
    </div>
  );
}









