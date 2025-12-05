"use client";

import { useState } from "react";
import type {
  PortfolioGeneratorResult,
  PortfolioItemSummary
} from "@/types/skill";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ui/error-alert";
import { postJson } from "@/lib/apiClient";
import { logUsage } from "@/lib/usageLogger";

type InputItem = {
  title: string;
  url: string;
  description: string;
};

export function PortfolioGeneratorSection() {
  const [items, setItems] = useState<InputItem[]>([
    { title: "", url: "", description: "" }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PortfolioGeneratorResult | null>(null);

  const updateItem = (index: number, field: keyof InputItem, value: string) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => {
    setItems((prev) => [...prev, { title: "", url: "", description: "" }]);
  };

  const handleGenerate = async () => {
    setError(null);
    setLoading(true);
    try {
      const payloadItems = items
        .filter(
          (i) => i.title.trim() || i.url.trim() || i.description.trim()
        )
        .map((i) => ({
          title: i.title.trim() || undefined,
          url: i.url.trim() || undefined,
          description: i.description.trim() || undefined
        }));

      if (payloadItems.length === 0) {
        setError("少なくとも1件はプロジェクト情報を入力してください。");
        setLoading(false);
        return;
      }

      void logUsage("portfolio_generate_clicked", {
        itemsCount: payloadItems.length
      });

      const data = await postJson<
        { items: { title?: string; url?: string; description?: string }[] },
        PortfolioGeneratorResult
      >("/api/portfolio", { items: payloadItems });
      setResult(data);
    } catch (e) {
      console.error(e);
      setError(
        "ポートフォリオ生成に失敗しました。入力内容を確認し、時間をおいて再度お試しください。"
      );
    } finally {
      setLoading(false);
    }
  };

  const copyMarkdown = async () => {
    if (!result?.markdown) return;
    await navigator.clipboard.writeText(result.markdown);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>ポートフォリオ棚卸しジェネレーター</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-relaxed">
        <p className="text-xs text-muted-foreground leading-relaxed">
          自分のプロジェクト（GitHub / 作品サイトなど）を入力すると、
          ポートフォリオに載せるべき案件 TOP3 と紹介文を自動生成します。
        </p>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="rounded-md border border-dashed p-3 space-y-2"
            >
              <p className="text-xs font-semibold text-muted-foreground">
                プロジェクト {index + 1}
              </p>
              <input
                type="text"
                className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="タイトル（例：AI Skill Map Generator）"
                value={item.title}
                onChange={(e) => updateItem(index, "title", e.target.value)}
              />
              <input
                type="url"
                className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="URL（例：https://github.com/username/project）"
                value={item.url}
                onChange={(e) => updateItem(index, "url", e.target.value)}
              />
              <textarea
                className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="簡単な説明や使用技術などがあれば入力（任意）"
                value={item.description}
                onChange={(e) =>
                  updateItem(index, "description", e.target.value)
                }
              />
            </div>
          ))}
          <Button type="button" size="sm" variant="outline" onClick={addItem}>
            プロジェクトを追加
          </Button>
        </div>

        {error && <ErrorAlert message={error} />}

        <Button
          type="button"
          size="sm"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "AI が整理中..." : "ポートフォリオ案を生成する"}
        </Button>

        {result && (
          <div className="space-y-3 border-t pt-3">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">
                選ばれた案件TOP3
              </p>
              {result.items.map((item: PortfolioItemSummary, index: number) => (
                <div key={index} className="rounded-md border p-2 space-y-1">
                  <p className="text-xs font-semibold">{item.title}</p>
                  {item.url && (
                    <a
                      href={item.url}
                      className="text-[11px] text-primary underline break-all"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.url}
                    </a>
                  )}
                  <p className="text-[11px] whitespace-pre-wrap">
                    {item.summary}
                  </p>
                  <p className="text-[11px] whitespace-pre-wrap">
                    <span className="font-semibold">アピールポイント:</span>{" "}
                    {item.sellingPoints}
                  </p>
                  <p className="text-[11px] whitespace-pre-wrap">
                    <span className="font-semibold">振り返り:</span>{" "}
                    {item.reflection}
                  </p>
                </div>
              ))}
            </div>

            {result.markdown && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">
                  Markdown 出力
                </p>
                <pre className="max-h-48 overflow-y-auto rounded-md border bg-muted p-2 text-[11px] whitespace-pre-wrap">
                  {result.markdown}
                </pre>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={copyMarkdown}
                >
                  Markdown をコピー
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


