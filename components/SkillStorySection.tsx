"use client";

import { useState, useEffect } from "react";
import type { SkillMapResult } from "@/types/skill";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ErrorAlert } from "@/components/ui/error-alert";
import { postJson } from "@/lib/apiClient";

interface SkillStorySectionProps {
  result: SkillMapResult;
}

export function SkillStorySection({ result }: SkillStorySectionProps) {
  const [story, setStory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>あなたのプロフィールストーリー</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <p className="text-xs text-muted-foreground">AI がストーリーを作成中です...</p>
        )}
        {error && <ErrorAlert message={error} />}
        {story && (
          <p className="whitespace-pre-wrap text-sm leading-relaxed md:columns-2 md:gap-6">
            {story}
          </p>
        )}
      </CardContent>
    </Card>
  );
}


