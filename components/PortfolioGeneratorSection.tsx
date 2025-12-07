"use client";

import { useState } from "react";
import type {
  PortfolioGeneratorResult,
  PortfolioItemSummary
} from "@/types/skill";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ui/error-alert";
import { postJson, isApiClientError } from "@/lib/apiClient";
import { logUsage } from "@/lib/usageLogger";
import { useTranslations } from "next-intl";

type InputItem = {
  title: string;
  url: string;
  description: string;
};

export function PortfolioGeneratorSection() {
  const t = useTranslations("portfolioGen");
  const [items, setItems] = useState<InputItem[]>([
    { title: "", url: "", description: "" }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PortfolioGeneratorResult | null>(null);
  const [copied, setCopied] = useState(false);

  const updateItem = (index: number, field: keyof InputItem, value: string) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => {
    setItems((prev) => [...prev, { title: "", url: "", description: "" }]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
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
        setError(t("errors.needItem"));
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
    } catch (e: unknown) {
      console.error(e);
      if (isApiClientError(e)) {
        setError(e.message || t("errors.generateFailed"));
      } else {
        setError(t("errors.generateFailed"));
      }
    } finally {
      setLoading(false);
    }
  };

  const copyMarkdown = async () => {
    if (!result?.markdown) return;
    await navigator.clipboard.writeText(result.markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in-up stagger-1">
      {/* Input section */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
          <CardTitle className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md text-sm">
              ✍️
            </span>
            {t("input.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            {t("input.description")}
          </p>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="group relative rounded-xl border-2 border-dashed border-slate-200 p-4 space-y-3 hover:border-amber-300 transition-colors animate-fade-in"
              >
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                  >
                    ✕
                  </button>
                )}
                
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-700">
                    {t("input.projectLabel", { index: index + 1 })}
                  </span>
                </div>
                
                <input
                  type="text"
                  className="w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition-all duration-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 focus:outline-none"
                  placeholder={t("input.titlePlaceholder")}
                  value={item.title}
                  onChange={(e) => updateItem(index, "title", e.target.value)}
                />
                <input
                  type="url"
                  className="w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition-all duration-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 focus:outline-none"
                  placeholder={t("input.urlPlaceholder")}
                  value={item.url}
                  onChange={(e) => updateItem(index, "url", e.target.value)}
                />
                <textarea
                  className="w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition-all duration-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 focus:outline-none resize-none"
                  placeholder={t("input.descPlaceholder")}
                  rows={2}
                  value={item.description}
                  onChange={(e) =>
                    updateItem(index, "description", e.target.value)
                  }
                />
              </div>
            ))}
          </div>

          <Button 
            type="button" 
            size="sm" 
            variant="outline" 
            onClick={addItem}
            className="w-full border-dashed"
          >
            <span>➕</span>
            {t("input.addButton")}
          </Button>

          {error && <ErrorAlert message={error} />}

          <Button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t("generateButton.generating")}
              </>
            ) : (
              <>
                <span>✨</span>
                {t("generateButton.default")}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Result section */}
      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <Card>
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
              <CardTitle className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md text-sm">
                  🏆
                </span>
                {t("result.top3Title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {result.items.map((item: PortfolioItemSummary, index: number) => (
                <div 
                  key={index} 
                  className="rounded-xl border border-slate-200 p-4 space-y-3 card-hover animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-md ${
                      index === 0 ? "bg-gradient-to-br from-amber-400 to-orange-500" :
                      index === 1 ? "bg-gradient-to-br from-slate-400 to-slate-500" :
                      "bg-gradient-to-br from-amber-600 to-amber-700"
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      {item.url && (
                        <a
                          href={item.url}
                          className="text-xs text-sky-600 hover:text-sky-700 underline break-all"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {item.url}
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {item.summary}
                  </p>
                  
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                      <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 mb-1">
                        <span>💪</span>
                        {t("result.sellingPointsTitle")}
                      </p>
                      <p className="text-xs text-slate-700 whitespace-pre-wrap">
                        {item.sellingPoints}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-sky-50 border border-sky-100">
                      <p className="text-xs font-semibold text-sky-700 flex items-center gap-1.5 mb-1">
                        <span>💭</span>
                        {t("result.reflectionTitle")}
                      </p>
                      <p className="text-xs text-slate-700 whitespace-pre-wrap">
                        {item.reflection}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {result.markdown && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>📄</span>
                    {t("result.markdownTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <pre className="max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700 whitespace-pre-wrap font-mono">
                  {result.markdown}
                </pre>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={copyMarkdown}
                >
                  {copied ? (
                    <>
                      <span className="text-emerald-500">✓</span>
                      {t("result.copyDone")}
                    </>
                  ) : (
                    <>
                      <span>📋</span>
                      {t("result.copyButton")}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
