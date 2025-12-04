"use client";

import { useState, useEffect } from "react";
import type { SkillMapResult } from "@/types/skill";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ErrorAlert } from "@/components/ui/error-alert";
import { Button } from "@/components/ui/button";
import { postJson } from "@/lib/apiClient";

interface SkillStorySectionProps {
  result: SkillMapResult;
}

function SkeletonLines() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="h-3 bg-slate-200 rounded w-full" />
      <div className="h-3 bg-slate-200 rounded w-11/12" />
      <div className="h-3 bg-slate-200 rounded w-full" />
      <div className="h-3 bg-slate-200 rounded w-4/5" />
      <div className="h-3 bg-slate-200 rounded w-full" />
      <div className="h-3 bg-slate-200 rounded w-3/4" />
    </div>
  );
}

export function SkillStorySection({ result }: SkillStorySectionProps) {
  const [story, setStory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await postJson<
          {
            strengths: string;
            weaknesses: string;
            categories: SkillMapResult["categories"];
          },
          { story: string }
        >("/api/story", {
          strengths: result.strengths,
          weaknesses: result.weaknesses,
          categories: result.categories
        });
        setStory(data.story);
      } catch (e) {
        console.error(e);
        setError(
          e instanceof Error ? e.message : "ストーリーを生成できませんでした。"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [result.strengths, result.weaknesses, result.categories]);

  const handleCopy = async () => {
    if (!story) return;
    await navigator.clipboard.writeText(story);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md">
            📖
          </span>
          あなたのプロフィールストーリー
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {loading && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              AI がストーリーを作成中です...
            </div>
            <SkeletonLines />
          </div>
        )}
        
        {error && <ErrorAlert message={error} />}
        
        {story && (
          <div className="space-y-4 animate-fade-in">
            <div className="relative">
              {/* Quote decoration */}
              <div className="absolute -left-2 -top-2 text-4xl text-indigo-200 font-serif">
                "
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 pl-6 md:columns-2 md:gap-8">
                {story}
              </p>
              <div className="absolute -right-2 bottom-0 text-4xl text-indigo-200 font-serif">
                "
              </div>
            </div>
            
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <span className="text-emerald-500">✓</span>
                    コピーしました！
                  </>
                ) : (
                  <>
                    <span>📋</span>
                    ストーリーをコピー
                  </>
                )}
              </Button>
              <p className="text-[10px] text-slate-500">
                職務経歴書や面接の自己紹介にご活用ください
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
