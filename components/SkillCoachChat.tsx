"use client";

import { useState } from "react";
import type { SkillMapResult } from "@/types/skill";
import { Button } from "@/components/ui/button";
import { postJson, isApiClientError } from "@/lib/apiClient";
import { useTranslations } from "next-intl";

interface SkillCoachChatProps {
  result: SkillMapResult;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function SkillCoachChat({ result }: SkillCoachChatProps) {
  const t = useTranslations("skillCoach");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user" as const, content: input }
    ];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const data = await postJson<
        {
          messages: ChatMessage[];
          context: {
            strengths: string;
            weaknesses: string;
            roadmap30: string;
            roadmap90: string;
          };
        },
        { reply: string }
      >("/api/coach", {
        messages: nextMessages,
        context: {
          strengths: result.strengths,
          weaknesses: result.weaknesses,
          roadmap30: result.roadmap30,
          roadmap90: result.roadmap90
        }
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant" as const, content: data.reply }
      ]);
    } catch (e: unknown) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant" as const,
          content: isApiClientError(e) ? e.message || t("errors.fallback") : t("errors.fallback")
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 space-y-3">
      <h3 className="text-lg font-semibold">{t("hero.title")}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {t("hero.body")}
      </p>
      <div className="border rounded-lg p-3 space-y-3 bg-muted/30">
        <div className="h-40 overflow-y-auto space-y-2 text-xs">
          {messages.length === 0 ? (
            <p className="text-muted-foreground">
              {t("chat.empty")}
            </p>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "text-right"
                    : "text-left text-primary"
                }
              >
                <span className="inline-block rounded-md px-2 py-1 bg-white/80 shadow-sm">
                  {m.content}
                </span>
              </div>
            ))
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder={t("chat.inputPlaceholder")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button type="button" size="sm" onClick={handleSend} disabled={loading}>
            {t("chat.send")}
          </Button>
        </div>
      </div>
    </div>
  );
}


