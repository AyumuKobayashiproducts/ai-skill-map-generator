"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  OneOnOneFeedback,
  OneOnOneQuestions,
  SkillMapResult,
  InterviewSessionSummary,
  InterviewSession
} from "@/types/skill";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ui/error-alert";
import { postJson } from "@/lib/apiClient";
import { logUsage } from "@/lib/usageLogger";

// ローカルストレージのキー
const ONBOARDING_KEY = "interview_practice_onboarding_seen";

type InterviewType = "general" | "technical" | "behavioral";

interface InterviewTypeOption {
  id: InterviewType;
  label: string;
  description: string;
  icon: string;
  color: string;
}

const interviewTypes: InterviewTypeOption[] = [
  {
    id: "general",
    label: "一般面接",
    description: "自己紹介・志望動機・キャリアプランなど",
    icon: "💬",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "technical",
    label: "技術面接",
    description: "技術スタック・設計判断・問題解決能力",
    icon: "💻",
    color: "from-emerald-500 to-teal-500"
  },
  {
    id: "behavioral",
    label: "行動面接",
    description: "STAR法による経験・実績の深掘り",
    icon: "🎯",
    color: "from-violet-500 to-purple-500"
  }
];

interface FeedbackHistory {
  question: string;
  answer: string;
  feedback: OneOnOneFeedback;
}

interface OneOnOnePracticeSectionProps {
  result: SkillMapResult;
}

type SessionState =
  | "select_type"
  | "loading_questions"
  | "practicing"
  | "getting_feedback"
  | "generating_summary"
  | "completed";

// スコアに応じた星評価を表示
function ScoreStars({ score }: { score: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`text-xl ${i <= score ? "text-yellow-400" : "text-slate-200"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// 初回ユーザー向けオンボーディングカード
function OnboardingCard({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div
      className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 p-5 space-y-4"
      role="region"
      aria-label="面接練習の使い方ガイド"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">📖</span>
          <h3 className="font-semibold text-blue-800">
            面接練習の使い方
          </h3>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="text-blue-400 hover:text-blue-600 text-sm"
          aria-label="ガイドを閉じる"
        >
          ✕ 閉じる
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex gap-3 items-start">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-medium">
            1
          </span>
          <div>
            <p className="text-sm font-medium text-blue-800">
              面接タイプを選ぶ
            </p>
            <p className="text-xs text-blue-600">
              一般・技術・行動の3タイプから、練習したい面接を選びます
            </p>
          </div>
        </div>

        <div className="flex gap-3 items-start">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-medium">
            2
          </span>
          <div>
            <p className="text-sm font-medium text-blue-800">
              質問に回答する
            </p>
            <p className="text-xs text-blue-600">
              AIがあなたのスキルに合わせた質問を出題。実際の面接のつもりで回答を書きます
            </p>
          </div>
        </div>

        <div className="flex gap-3 items-start">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-medium">
            3
          </span>
          <div>
            <p className="text-sm font-medium text-blue-800">
              フィードバックをもらう
            </p>
            <p className="text-xs text-blue-600">
              各回答に対してAIがレビュー。改善点と模範回答を確認できます
            </p>
          </div>
        </div>

        <div className="flex gap-3 items-start">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center font-medium">
            ✓
          </span>
          <div>
            <p className="text-sm font-medium text-blue-800">
              総評を確認する
            </p>
            <p className="text-xs text-blue-600">
              セッション終了後、総合評価と次回までの宿題が表示されます
            </p>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-blue-200">
        <p className="text-xs text-blue-500">
          💡 ヒント: 繰り返し練習すると、過去のスコアとの比較ができます
        </p>
      </div>
    </div>
  );
}

// 練習中のヒントカード
function PracticeHintCard({
  questionIndex,
  interviewType
}: {
  questionIndex: number;
  interviewType: InterviewType;
}) {
  const hints: Record<InterviewType, string[]> = {
    general: [
      "自己紹介は1〜2分で収まる長さが理想です。要点を絞って伝えましょう。",
      "志望動機は「なぜこの会社か」を具体的に。企業研究が伝わる内容に。",
      "キャリアプランは3〜5年後をイメージして、成長意欲を示しましょう。",
      "強みは具体的なエピソードで裏付けると説得力が増します。",
      "弱みは「克服のために取り組んでいること」もセットで伝えましょう。"
    ],
    technical: [
      "技術選定の理由を「なぜその技術を選んだか」で説明できると◎",
      "数字（パフォーマンス改善率、処理速度など）があると説得力UP",
      "チーム開発での役割や、レビュー・設計判断の経験を盛り込みましょう",
      "失敗経験も「何を学んだか」をセットで話すと好印象です",
      "最新技術のキャッチアップ方法も聞かれやすいポイントです"
    ],
    behavioral: [
      "STAR法: まずSituation（状況）を簡潔に説明しましょう",
      "STAR法: Task（課題）は「何を解決すべきだったか」を明確に",
      "STAR法: Action（行動）は「あなた自身が何をしたか」に焦点を",
      "STAR法: Result（結果）は数字や具体的な成果で示しましょう",
      "「チームとして」ではなく「私が」という主語を意識しましょう"
    ]
  };

  const typeHints = hints[interviewType];
  const hint = typeHints[questionIndex % typeHints.length];

  return (
    <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
      <p className="text-xs text-amber-700">
        <span className="font-medium">💡 ヒント:</span> {hint}
      </p>
    </div>
  );
}

// スコアの差分を表示
function ScoreDiff({ current, previous }: { current: number; previous: number }) {
  const diff = current - previous;
  if (diff === 0) return <span className="text-slate-400 text-xs">→</span>;
  if (diff > 0)
    return <span className="text-emerald-500 text-xs font-medium">+{diff} ↑</span>;
  return <span className="text-red-500 text-xs font-medium">{diff} ↓</span>;
}

// 過去のセッション履歴カード
function SessionHistoryCard({
  sessions,
  currentType
}: {
  sessions: InterviewSession[];
  currentType: InterviewType | null;
}) {
  const filteredSessions = currentType
    ? sessions.filter((s) => s.interview_type === currentType)
    : sessions;

  if (filteredSessions.length === 0) return null;

  const typeLabel = interviewTypes.find((t) => t.id === currentType)?.label;

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
        📊 {typeLabel ? `${typeLabel}の` : ""}過去の練習履歴
      </p>
      <div className="space-y-2">
        {filteredSessions.slice(0, 5).map((session) => (
          <div
            key={session.id}
            className="flex items-center justify-between text-xs bg-white rounded-md px-3 py-2 border border-slate-100"
          >
            <div className="flex items-center gap-2">
              <span className="text-slate-400">
                {new Date(session.created_at).toLocaleDateString("ja-JP", {
                  month: "short",
                  day: "numeric"
                })}
              </span>
              <span className="text-slate-600">
                {session.question_count}問
              </span>
            </div>
            <div className="flex items-center gap-1">
              {session.overall_score && (
                <>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span
                      key={i}
                      className={`text-xs ${
                        i <= session.overall_score! ? "text-yellow-400" : "text-slate-200"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      {filteredSessions.length > 0 && (
        <div className="pt-2 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            平均スコア:{" "}
            <span className="font-medium text-slate-700">
              {(
                filteredSessions
                  .filter((s) => s.overall_score)
                  .reduce((sum, s) => sum + (s.overall_score ?? 0), 0) /
                  filteredSessions.filter((s) => s.overall_score).length || 0
              ).toFixed(1)}
            </span>
            <span className="mx-2">|</span>
            練習回数:{" "}
            <span className="font-medium text-slate-700">
              {filteredSessions.length}回
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

export function OneOnOnePracticeSection({
  result
}: OneOnOnePracticeSectionProps) {
  const [sessionState, setSessionState] = useState<SessionState>("select_type");
  const [selectedType, setSelectedType] = useState<InterviewType | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [currentFeedback, setCurrentFeedback] =
    useState<OneOnOneFeedback | null>(null);
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackHistory[]>([]);
  const [sessionSummary, setSessionSummary] =
    useState<InterviewSessionSummary | null>(null);
  const [pastSessions, setPastSessions] = useState<InterviewSession[]>([]);
  const [previousSession, setPreviousSession] =
    useState<InterviewSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const currentQuestion = questions[currentIndex] ?? null;

  // オンボーディング表示の判定
  useEffect(() => {
    if (typeof window !== "undefined") {
      const seen = localStorage.getItem(ONBOARDING_KEY);
      if (!seen) {
        setShowOnboarding(true);
      }
    }
  }, []);

  const dismissOnboarding = useCallback(() => {
    setShowOnboarding(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(ONBOARDING_KEY, "true");
    }
  }, []);

  // 過去のセッション履歴を取得
  useEffect(() => {
    const fetchPastSessions = async () => {
      try {
        const res = await fetch(
          `/api/oneonone/sessions?skillMapId=${result.id}&limit=20`
        );
        if (res.ok) {
          const data = await res.json();
          setPastSessions(data.sessions ?? []);
        }
      } catch (e) {
        console.error("Failed to fetch past sessions", e);
      }
    };
    fetchPastSessions();
  }, [result.id]);

  const startSession = useCallback(
    async (type: InterviewType) => {
      setSelectedType(type);
      setSessionState("loading_questions");
      setError(null);

      // 同じタイプの直前のセッションを取得
      const lastSession = pastSessions.find((s) => s.interview_type === type);
      setPreviousSession(lastSession ?? null);

      try {
        void logUsage("interview_practice_started", { type });
        const data = await postJson<
          { skillMapId: string; interviewType: string },
          OneOnOneQuestions
        >("/api/oneonone/questions", {
          skillMapId: result.id,
          interviewType: type
        });

        if (!data.questions || data.questions.length === 0) {
          throw new Error("質問が生成されませんでした");
        }

        setQuestions(data.questions);
        setCurrentIndex(0);
        setAnswer("");
        setCurrentFeedback(null);
        setFeedbackHistory([]);
        setSessionSummary(null);
        setSessionState("practicing");
      } catch (e) {
        console.error(e);
        setError(
          "面接質問の取得に失敗しました。時間をおいてから、もう一度お試しください。"
        );
        setSessionState("select_type");
      }
    },
    [result.id, pastSessions]
  );

  const handleSubmitAnswer = useCallback(async () => {
    if (!currentQuestion || !answer.trim()) {
      setError("質問への回答を入力してください。");
      return;
    }

    setSessionState("getting_feedback");
    setError(null);

    try {
      void logUsage("interview_feedback_requested");
      const data = await postJson<
        {
          question: string;
          answer: string;
          strengths: string;
          weaknesses: string;
          interviewType: string;
        },
        OneOnOneFeedback
      >("/api/oneonone/feedback", {
        question: currentQuestion,
        answer,
        strengths: result.strengths,
        weaknesses: result.weaknesses,
        interviewType: selectedType ?? "general"
      });

      // 詳細なログを記録
      void logUsage("interview_answer_submitted", {
        type: selectedType,
        questionIndex: currentIndex,
        answerLength: answer.length,
        ruleBasedScore: data.ruleBasedScore,
        ruleBasedScores: data.ruleBasedScores
      });

      setCurrentFeedback(data);
      setFeedbackHistory((prev) => [
        ...prev,
        { question: currentQuestion, answer, feedback: data }
      ]);
      setSessionState("practicing");
    } catch (e) {
      console.error(e);
      setError(
        "フィードバックの取得に失敗しました。回答内容を確認し、時間をおいて再度お試しください。"
      );
      setSessionState("practicing");
    }
  }, [
    currentQuestion,
    answer,
    result.strengths,
    result.weaknesses,
    selectedType
  ]);

  const saveSession = useCallback(
    async (summary: InterviewSessionSummary) => {
      try {
        await postJson("/api/oneonone/sessions", {
          skillMapId: result.id,
          interviewType: selectedType,
          questionCount: feedbackHistory.length,
          overallScore: summary.overallScore,
          strongPoints: summary.strongPoints,
          improvementPoints: summary.improvementPoints,
          nextSteps: summary.nextSteps,
          summary: summary.summary,
          exchanges: feedbackHistory.map((h) => ({
            question: h.question,
            answer: h.answer,
            feedback: h.feedback.feedback
          }))
        });
      } catch (e) {
        console.error("Failed to save session", e);
      }
    },
    [result.id, selectedType, feedbackHistory]
  );

  const generateSessionSummary = useCallback(async () => {
    setSessionState("generating_summary");
    setError(null);

    try {
      // セッション完了の詳細ログ
      const avgScore =
        feedbackHistory
          .map((h) => h.feedback.ruleBasedScore ?? 0)
          .reduce((a, b) => a + b, 0) / feedbackHistory.length || 0;

      void logUsage("interview_session_completed", {
        type: selectedType,
        questionCount: feedbackHistory.length,
        totalAnswerLength: feedbackHistory.reduce(
          (sum, h) => sum + h.answer.length,
          0
        ),
        averageRuleBasedScore: Math.round(avgScore),
        sessionDurationEstimate: feedbackHistory.length * 3 // 約3分/問と仮定
      });

      const data = await postJson<
        {
          interviewType: string;
          exchanges: { question: string; answer: string; feedback: string }[];
          strengths?: string;
          weaknesses?: string;
        },
        InterviewSessionSummary
      >("/api/oneonone/summary", {
        interviewType: selectedType ?? "general",
        exchanges: feedbackHistory.map((h) => ({
          question: h.question,
          answer: h.answer,
          feedback: h.feedback.feedback
        })),
        strengths: result.strengths,
        weaknesses: result.weaknesses
      });

      setSessionSummary(data);

      // セッションを保存
      await saveSession(data);

      setSessionState("completed");
    } catch (e) {
      console.error(e);
      setError("総評の生成に失敗しました。");
      setSessionState("completed");
    }
  }, [
    selectedType,
    feedbackHistory,
    result.strengths,
    result.weaknesses,
    saveSession
  ]);

  const handleNextQuestion = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      // セッション終了 → 総評を生成
      void generateSessionSummary();
    } else {
      setCurrentIndex((idx) => idx + 1);
      setAnswer("");
      setCurrentFeedback(null);
    }
  }, [currentIndex, questions.length, generateSessionSummary]);

  const handleRestartSession = useCallback(() => {
    setSessionState("select_type");
    setSelectedType(null);
    setQuestions([]);
    setCurrentIndex(0);
    setAnswer("");
    setCurrentFeedback(null);
    setFeedbackHistory([]);
    setSessionSummary(null);
    setPreviousSession(null);
    setError(null);
  }, []);

  const handleRetryWithSameType = useCallback(() => {
    if (selectedType) {
      startSession(selectedType);
    }
  }, [selectedType, startSession]);

  // 面接タイプ選択画面
  if (sessionState === "select_type") {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🎤</span>
            転職面接練習モード
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* オンボーディング（初回のみ表示） */}
          {showOnboarding && (
            <OnboardingCard onDismiss={dismissOnboarding} />
          )}

          {!showOnboarding && (
            <div className="text-center space-y-2">
              <p className="text-sm text-slate-600 leading-relaxed">
                AIが面接官役となり、あなたのスキルマップに基づいた質問を出題します。
                <br />
                回答に対してフィードバックと模範回答をもらえるので、本番前の練習に最適です。
              </p>
            </div>
          )}

          {error && <ErrorAlert message={error} />}

          <div className="space-y-3" role="group" aria-labelledby="interview-type-label">
            <p id="interview-type-label" className="text-sm font-medium text-slate-700">
              練習したい面接タイプを選んでください
            </p>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3" role="list">
              {interviewTypes.map((type) => {
                const typeSessionCount = pastSessions.filter(
                  (s) => s.interview_type === type.id
                ).length;
                return (
                  <button
                    key={type.id}
                    type="button"
                    role="listitem"
                    onClick={() => startSession(type.id)}
                    aria-label={`${type.label}を開始。${type.description}。${typeSessionCount > 0 ? `過去${typeSessionCount}回練習済み` : "初回の練習"}`}
                    className="group relative overflow-hidden rounded-xl border-2 border-slate-200 bg-white p-4 text-left transition-all hover:border-slate-400 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 touch-target min-h-[100px]"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 transition-opacity group-hover:opacity-5`}
                      aria-hidden="true"
                    />
                    <div className="relative space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl" aria-hidden="true">{type.icon}</span>
                          <span className="font-semibold text-slate-800">
                            {type.label}
                          </span>
                        </div>
                        {typeSessionCount > 0 && (
                          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            {typeSessionCount}回
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {type.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 過去のセッション履歴 */}
          {pastSessions.length > 0 && (
            <SessionHistoryCard sessions={pastSessions} currentType={null} />
          )}

          <div className="rounded-lg bg-slate-50 p-4 text-xs text-slate-600 leading-relaxed">
            <p className="font-medium text-slate-700 mb-2">
              💡 効果的な練習のコツ
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>実際の面接と同じように、声に出して回答を考えてから書く</li>
              <li>具体的なエピソードや数字を盛り込むことを意識する</li>
              <li>STAR法（状況→課題→行動→結果）を意識して構成する</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 質問読み込み中
  if (sessionState === "loading_questions") {
    const selectedOption = interviewTypes.find((t) => t.id === selectedType);
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>{selectedOption?.icon}</span>
            {selectedOption?.label}
          </CardTitle>
        </CardHeader>
        <CardContent className="py-12 text-center">
          <div className="inline-flex items-center gap-3 text-slate-600">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
            <span className="text-sm">
              あなたのスキルに合わせた面接質問を生成中...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 総評生成中
  if (sessionState === "generating_summary") {
    const selectedOption = interviewTypes.find((t) => t.id === selectedType);
    return (
      <Card>
        <CardHeader
          className={`bg-gradient-to-r ${selectedOption?.color} text-white`}
        >
          <CardTitle className="flex items-center gap-2">
            <span>{selectedOption?.icon}</span>
            {selectedOption?.label}
          </CardTitle>
        </CardHeader>
        <CardContent className="py-12 text-center">
          <div className="inline-flex items-center gap-3 text-slate-600">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
            <span className="text-sm">セッションの総評を作成中...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 練習完了画面（総評付き）
  if (sessionState === "completed") {
    const totalQuestions = feedbackHistory.length;
    const selectedOption = interviewTypes.find((t) => t.id === selectedType);

    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🎉</span>
            セッション完了！
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {error && <ErrorAlert message={error} />}

          <div className="text-center space-y-3">
            <p className="text-lg font-semibold text-slate-800">
              お疲れさまでした！
            </p>
            <p className="text-sm text-slate-600">
              {selectedOption?.label}で {totalQuestions} 問の練習を完了しました。
            </p>
            {sessionSummary && (
              <div className="pt-2">
                <p className="text-xs text-slate-500 mb-1">総合評価</p>
                <div className="flex items-center justify-center gap-2">
                  <ScoreStars score={sessionSummary.overallScore} />
                  {previousSession?.overall_score && (
                    <ScoreDiff
                      current={sessionSummary.overallScore}
                      previous={previousSession.overall_score}
                    />
                  )}
                </div>
                {previousSession?.overall_score && (
                  <p className="text-xs text-slate-400 mt-1">
                    前回: {previousSession.overall_score}点
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 総評セクション */}
          {sessionSummary && (
            <div className="space-y-4">
              {/* 総評コメント */}
              <div className="rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  📝 総評
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {sessionSummary.summary}
                </p>
              </div>

              {/* 良かった点・改善点・次のステップ */}
              <div className="grid gap-4 md:grid-cols-3">
                {/* 良かった点 */}
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4">
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2">
                    ✅ 良かった点
                  </p>
                  <ul className="space-y-1">
                    {sessionSummary.strongPoints.map((point, i) => (
                      <li
                        key={i}
                        className="text-xs text-emerald-800 flex items-start gap-1"
                      >
                        <span className="text-emerald-500 mt-0.5">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 改善点 */}
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">
                    🔧 改善点
                  </p>
                  <ul className="space-y-1">
                    {sessionSummary.improvementPoints.map((point, i) => (
                      <li
                        key={i}
                        className="text-xs text-amber-800 flex items-start gap-1"
                      >
                        <span className="text-amber-500 mt-0.5">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 次のステップ */}
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">
                    🎯 次回までにやること
                  </p>
                  <ul className="space-y-1">
                    {sessionSummary.nextSteps.map((step, i) => (
                      <li
                        key={i}
                        className="text-xs text-blue-800 flex items-start gap-1"
                      >
                        <span className="text-blue-500 mt-0.5">{i + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 質疑応答履歴 */}
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-slate-600 hover:text-slate-800 flex items-center gap-2">
              <span className="transition-transform group-open:rotate-90">
                ▶
              </span>
              質疑応答の詳細を見る
            </summary>
            <div className="mt-3 space-y-3 max-h-80 overflow-y-auto">
              {feedbackHistory.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-slate-200 bg-white p-4 space-y-3"
                >
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      質問 {index + 1}
                    </p>
                    <p className="text-sm text-slate-800">{item.question}</p>
                  </div>
                  <div className="border-t border-slate-100 pt-3">
                    <p className="text-xs font-medium text-slate-500 mb-1">
                      あなたの回答
                    </p>
                    <p className="text-xs text-slate-600 whitespace-pre-wrap">
                      {item.answer}
                    </p>
                  </div>
                  <div className="border-t border-slate-100 pt-3">
                    <p className="text-xs font-medium text-emerald-600 mb-1">
                      フィードバック
                    </p>
                    <p className="text-xs text-slate-600 whitespace-pre-wrap">
                      {item.feedback.feedback}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </details>

          <div className="flex flex-wrap gap-3 justify-center pt-4 border-t border-slate-200">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetryWithSameType}
            >
              同じタイプで再挑戦
            </Button>
            <Button size="sm" onClick={handleRestartSession}>
              別のタイプを選ぶ
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 練習中の画面
  const selectedOption = interviewTypes.find((t) => t.id === selectedType);
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <Card className="overflow-hidden">
      <CardHeader
        className={`bg-gradient-to-r ${selectedOption?.color} text-white`}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span>{selectedOption?.icon}</span>
            {selectedOption?.label}
          </CardTitle>
          <span className="text-sm opacity-90">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
        {/* プログレスバー */}
        <div className="mt-3 h-1.5 w-full rounded-full bg-white/30 overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        {error && <ErrorAlert message={error} />}

        {/* 質問 */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            面接質問
          </p>
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
            <p className="text-sm text-slate-800 leading-relaxed">
              {currentQuestion}
            </p>
          </div>
        </div>

        {/* ヒントカード */}
        {!currentFeedback && selectedType && (
          <PracticeHintCard
            questionIndex={currentIndex}
            interviewType={selectedType}
          />
        )}

        {/* 回答入力 */}
        <div className="space-y-2">
          <label
            htmlFor="interview-answer"
            className="text-xs font-medium text-slate-500 uppercase tracking-wide"
          >
            あなたの回答
          </label>
          <textarea
            id="interview-answer"
            name="interview-answer"
            aria-describedby="answer-hint"
            className="w-full min-h-[160px] sm:min-h-[140px] rounded-lg border border-slate-300 bg-white px-4 py-3 text-base sm:text-sm text-slate-800 placeholder:text-slate-400 shadow-sm transition-colors focus:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 resize-none"
            placeholder="実際の面接で話すつもりで、できるだけ具体的に書いてみてください。"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                void handleSubmitAnswer();
              }
            }}
            disabled={sessionState === "getting_feedback"}
            aria-disabled={sessionState === "getting_feedback"}
          />
          <p id="answer-hint" className="text-xs text-slate-400 sr-only sm:not-sr-only">
            💡 Ctrl+Enter / Cmd+Enter でフィードバックを取得できます
          </p>
        </div>

        {/* アクションボタン */}
        <div className="flex flex-wrap gap-3" role="group" aria-label="アクション">
          {!currentFeedback ? (
            <Button
              type="button"
              onClick={handleSubmitAnswer}
              disabled={sessionState === "getting_feedback" || !answer.trim()}
              aria-busy={sessionState === "getting_feedback"}
              className="min-w-[180px] touch-target"
            >
              {sessionState === "getting_feedback" ? (
                <span className="flex items-center gap-2">
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                    aria-hidden="true"
                  />
                  <span aria-live="polite">AI がレビュー中...</span>
                </span>
              ) : (
                "フィードバックをもらう"
              )}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNextQuestion}
              className="touch-target"
            >
              {currentIndex + 1 >= questions.length
                ? "練習を終了して総評を見る"
                : "次の質問へ →"}
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRestartSession}
            className="text-slate-500 hover:text-slate-700 touch-target"
            aria-label="練習をやめてタイプ選択に戻る"
          >
            やめる
          </Button>
        </div>

        {/* フィードバック表示 */}
        {currentFeedback && (
          <div className="space-y-4 pt-4 border-t border-slate-200">
            {/* ルールベーススコア表示 */}
            {currentFeedback.ruleBasedScore !== undefined && (
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    📊 回答品質スコア
                  </p>
                  <span className="text-lg font-bold text-slate-800">
                    {currentFeedback.ruleBasedScore}
                    <span className="text-sm font-normal text-slate-500">/100</span>
                  </span>
                </div>
                {currentFeedback.ruleBasedScores && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { key: "length", label: "文字数", color: "bg-blue-500" },
                      { key: "specificity", label: "具体性", color: "bg-emerald-500" },
                      { key: "structure", label: "構造", color: "bg-violet-500" },
                      { key: "starElements", label: "STAR要素", color: "bg-amber-500" }
                    ].map(({ key, label, color }) => (
                      <div key={key} className="text-center">
                        <p className="text-[10px] text-slate-500 mb-1">{label}</p>
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${color} transition-all duration-500`}
                            style={{
                              width: `${currentFeedback.ruleBasedScores![key as keyof typeof currentFeedback.ruleBasedScores]}%`
                            }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-600 mt-0.5">
                          {currentFeedback.ruleBasedScores![key as keyof typeof currentFeedback.ruleBasedScores]}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 space-y-2">
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                💡 フィードバック
              </p>
              <p className="text-sm text-blue-900 whitespace-pre-wrap leading-relaxed">
                {currentFeedback.feedback}
              </p>
            </div>

            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 space-y-2">
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                ✨ 模範回答の例
              </p>
              <p className="text-sm text-emerald-900 whitespace-pre-wrap leading-relaxed">
                {currentFeedback.improvedAnswer}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
