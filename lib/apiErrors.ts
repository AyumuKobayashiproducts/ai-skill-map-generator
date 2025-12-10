import type { Locale } from "@/src/i18n/config";

export type ApiErrorCode =
  | "GENERATE_SAVE_FAILED"
  | "GENERATE_OPENAI_ERROR"
  | "JOB_MATCH_NOT_FOUND"
  | "JOB_MATCH_OPENAI_ERROR"
  | "TODAY_TASK_NOT_FOUND"
  | "TODAY_TASK_OPENAI_ERROR"
  | "TIME_SIM_NOT_FOUND"
  | "TIME_SIM_OPENAI_ERROR"
  | "RISK_NOT_FOUND"
  | "RISK_OPENAI_ERROR"
  | "STORY_OPENAI_ERROR"
  | "PORTFOLIO_OPENAI_ERROR"
  | "COACH_OPENAI_ERROR"
  | "ONEONONE_SUMMARY_NO_EXCHANGES"
  | "ONEONONE_SUMMARY_OPENAI_ERROR"
  | "ONEONONE_QUESTIONS_NOT_FOUND"
  | "ONEONONE_QUESTIONS_OPENAI_ERROR"
  | "ONEONONE_SESSIONS_FETCH_FAILED"
  | "ONEONONE_SESSIONS_SAVE_FAILED"
  | "READINESS_NOT_FOUND"
  | "READINESS_OPENAI_ERROR"
  | "MAPS_FETCH_FAILED"
  | "USAGE_LOG_INSERT_FAILED"
  | "USAGE_LOG_ERROR"
  | "EXPORT_SKILLMAP_NOT_FOUND";

type MessageMap = Record<ApiErrorCode, Record<Locale, string>>;

const messages: MessageMap = {
  GENERATE_SAVE_FAILED: {
    ja: "データの保存に失敗しました。",
    en: "Failed to save the diagnosis result. Please try again in a few minutes."
  },
  GENERATE_OPENAI_ERROR: {
    ja: "AI 解析中にエラーが発生しました。",
    en: "An error occurred while running the AI analysis. Please try again later."
  },
  JOB_MATCH_NOT_FOUND: {
    ja: "指定されたスキルマップが見つかりませんでした。",
    en: "The specified skill map could not be found."
  },
  JOB_MATCH_OPENAI_ERROR: {
    ja: "求人マッチング中にエラーが発生しました。",
    en: "An error occurred while running the job matching analysis."
  },
  TODAY_TASK_NOT_FOUND: {
    ja: "指定されたスキルマップが見つかりませんでした。",
    en: "The specified skill map could not be found."
  },
  TODAY_TASK_OPENAI_ERROR: {
    ja: "今日のタスク生成中にエラーが発生しました。",
    en: "An error occurred while generating today’s learning task."
  },
  TIME_SIM_NOT_FOUND: {
    ja: "指定されたスキルマップが見つかりませんでした。",
    en: "The specified skill map could not be found."
  },
  TIME_SIM_OPENAI_ERROR: {
    ja: "学習時間シミュレーション中にエラーが発生しました。",
    en: "An error occurred while simulating your learning schedule."
  },
  RISK_NOT_FOUND: {
    ja: "指定されたスキルマップが見つかりませんでした。",
    en: "The specified skill map could not be found."
  },
  RISK_OPENAI_ERROR: {
    ja: "キャリアリスク分析中にエラーが発生しました。",
    en: "An error occurred while analyzing career risks."
  },
  STORY_OPENAI_ERROR: {
    ja: "ストーリー生成中にエラーが発生しました。",
    en: "An error occurred while generating your profile story."
  },
  PORTFOLIO_OPENAI_ERROR: {
    ja: "ポートフォリオ生成中にエラーが発生しました。",
    en: "An error occurred while generating your portfolio summary."
  },
  COACH_OPENAI_ERROR: {
    ja: "AI コーチとの対話中にエラーが発生しました。",
    en: "An error occurred while talking with the AI coach."
  },
  ONEONONE_SUMMARY_NO_EXCHANGES: {
    ja: "回答履歴がありません。",
    en: "There is no answer history to summarize."
  },
  ONEONONE_SUMMARY_OPENAI_ERROR: {
    ja: "セッション総評の生成中にエラーが発生しました。",
    en: "An error occurred while generating the session summary."
  },
  ONEONONE_QUESTIONS_NOT_FOUND: {
    ja: "指定されたスキルマップが見つかりませんでした。",
    en: "The specified skill map could not be found."
  },
  ONEONONE_QUESTIONS_OPENAI_ERROR: {
    ja: "面接質問の生成中にエラーが発生しました。",
    en: "An error occurred while generating interview questions."
  },
  ONEONONE_SESSIONS_FETCH_FAILED: {
    ja: "セッション履歴の取得に失敗しました。",
    en: "Failed to fetch interview session history."
  },
  ONEONONE_SESSIONS_SAVE_FAILED: {
    ja: "セッションの保存に失敗しました。",
    en: "Failed to save the interview session."
  },
  READINESS_NOT_FOUND: {
    ja: "指定されたスキルマップが見つかりませんでした。",
    en: "The specified skill map could not be found."
  },
  READINESS_OPENAI_ERROR: {
    ja: "転職準備スコア算出中にエラーが発生しました。",
    en: "An error occurred while calculating the readiness score."
  },
  MAPS_FETCH_FAILED: {
    ja: "一覧の取得に失敗しました。",
    en: "Failed to fetch the list of skill maps."
  },
  USAGE_LOG_INSERT_FAILED: {
    ja: "usage log insert failed",
    en: "Failed to insert usage log."
  },
  USAGE_LOG_ERROR: {
    ja: "usage log error",
    en: "An error occurred while handling usage logging."
  },
  EXPORT_SKILLMAP_NOT_FOUND: {
    ja: "指定されたスキルマップが見つかりませんでした。",
    en: "Skill map not found."
  }
};

export function getApiError(
  code: ApiErrorCode,
  locale: Locale
): { code: ApiErrorCode; message: string } {
  const entry = messages[code];
  if (!entry) {
    return {
      code,
      message:
        locale === "en"
          ? "An unexpected error occurred."
          : "予期しないエラーが発生しました。"
    };
  }

  const message = entry[locale] ?? entry.ja;
  return { code, message };
}








