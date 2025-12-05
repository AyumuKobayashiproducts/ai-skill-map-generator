"use client";

import { useEffect, useState } from "react";
import type {
  OneOnOneFeedback,
  OneOnOneQuestions,
  SkillMapResult
} from "@/types/skill";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ui/error-alert";
import { postJson } from "@/lib/apiClient";
import { logUsage } from "@/lib/usageLogger";

interface OneOnOnePracticeSectionProps {
  result: SkillMapResult;
}

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            i < current
              ? "bg-emerald-500"
              : i === current
              ? "bg-sky-500 scale-125"
              : "bg-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

export function OneOnOnePracticeSection({
  result
}: OneOnOnePracticeSectionProps) {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<OneOnOneFeedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuestions = async () => {
      setError(null);
      setQuestionsLoading(true);
      try {
        const data = await postJson<{ skillMapId: string }, OneOnOneQuestions>(
          "/api/oneonone/questions",
          { skillMapId: result.id }
        );
        setQuestions(data.questions ?? []);
      } catch (e) {
        console.error(e);
        setError(
          "1on1 の質問取得に失敗しました。時間をおいてから、もう一度お試しください。"
        );
      } finally {
        setQuestionsLoading(false);
      }
    };

    loadQuestions();
  }, [result.id]);

  const currentQuestion = questions[currentIndex] ?? null;

  const handleFeedback = async () => {
    if (!currentQuestion || !answer.trim()) {
      setError("質問への回答を入力してください。");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      void logUsage("oneonone_feedback_clicked");
      const data = await postJson<
        {
          question: string;
          answer: string;
          strengths: string;
          weaknesses: string;
        },
        OneOnOneFeedback
      >("/api/oneonone/feedback", {
        question: currentQuestion,
        answer,
        strengths: result.strengths,
        weaknesses: result.weaknesses
      });
      setFeedback(data);
    } catch (e) {
      console.error(e);
      setError(
        "フィードバックの取得に失敗しました。回答内容を確認し、時間をおいて再度お試しください。"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setFeedback(null);
    setAnswer("");
    setCurrentIndex((idx) =>
      idx + 1 < questions.length ? idx + 1 : questions.length - 1
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50">
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white shadow-md">
            🎤
          </span>
          1on1 練習モード
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <p className="text-xs text-slate-600 leading-relaxed">
          評価面談でよく聞かれる質問に対して回答を考え、AI マネージャーからフィードバックと模範回答をもらえます。
        </p>

        {error && <ErrorAlert message={error} />}

        {questionsLoading ? (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50">
            <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-slate-600">質問を準備しています...</span>
          </div>
        ) : !currentQuestion ? (
          <div className="text-center py-8">
            <span className="text-4xl">😢</span>
            <p className="text-sm text-slate-500 mt-2">
              質問の取得に失敗しました
            </p>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {/* Progress */}
            <div className="flex items-center justify-between">
              <ProgressDots current={currentIndex} total={questions.length} />
              <span className="text-xs text-slate-500">
                {currentIndex + 1} / {questions.length}
              </span>
            </div>

            {/* Question */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white text-sm flex-shrink-0">
                  Q
                </div>
                <p className="text-sm text-slate-800 leading-relaxed pt-1">
                  {currentQuestion}
                </p>
              </div>
            </div>

            {/* Answer input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <span>💬</span>
                あなたの回答
              </label>
              <div className="relative">
                <textarea
                  className="w-full min-h-[140px] rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition-all duration-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 focus:outline-none resize-none"
                  placeholder="実際の1on1で話すつもりで、できるだけ具体的に書いてみてください。"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                      e.preventDefault();
                      void handleFeedback();
                    }
                  }}
                />
                <div className="absolute bottom-2 right-2 text-[10px] text-slate-400">
                  ⌘+Enter で送信
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                onClick={handleFeedback}
                disabled={loading || !answer.trim()}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    AI がレビュー中...
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    フィードバックをもらう
                  </>
                )}
              </Button>
              {feedback && currentIndex + 1 < questions.length && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleNext}
                >
                  次の質問へ →
                </Button>
              )}
            </div>

            {/* Feedback */}
            {feedback && (
              <div className="space-y-4 pt-4 border-t border-slate-100 animate-fade-in-up">
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm flex-shrink-0">
                      💡
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-amber-700 mb-1">
                        フィードバック
                      </p>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {feedback.feedback}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm flex-shrink-0">
                      ✓
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-emerald-700 mb-1">
                        模範回答の例
                      </p>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {feedback.improvedAnswer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
