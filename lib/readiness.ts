import type { SkillCategories, ReadinessScoreResult } from "@/types/skill";
import type { Locale } from "@/src/i18n/config";

export interface ReadinessParams {
  categories: SkillCategories;
  jobMatchScore?: number;
  riskObsolescence?: number;
  riskBusFactor?: number;
  riskAutomation?: number;
  prepScore?: number;
}

// 転職準備スコア計算ロジックを純粋関数として切り出し
export function calculateReadinessScore(
  params: ReadinessParams,
  locale: Locale = "ja"
): ReadinessScoreResult {
  const {
    categories,
    jobMatchScore,
    riskObsolescence,
    riskBusFactor,
    riskAutomation,
    prepScore
  } = params;

  const levels = [
    categories.frontend ?? 0,
    categories.backend ?? 0,
    categories.infra ?? 0,
    categories.ai ?? 0,
    categories.tools ?? 0
  ];

  const avgLevel =
    levels.reduce((sum, v) => sum + (v || 0), 0) /
    (levels.length || 1);

  // 1) スキルスコア 0-40
  const skillScore = Math.max(0, Math.min(40, (avgLevel / 5) * 40));

  // 2) 求人マッチングスコア 0-30
  const jm = typeof jobMatchScore === "number" ? jobMatchScore : 50;
  const jobScore = Math.max(0, Math.min(30, (jm / 100) * 30));

  // 3) キャリアリスク 0-20（低いほど高得点）
  const risks = [
    riskObsolescence ?? 50,
    riskBusFactor ?? 50,
    riskAutomation ?? 50
  ];
  const riskAvg = risks.reduce((s, v) => s + v, 0) / risks.length;
  const riskScore = Math.max(
    0,
    Math.min(20, ((100 - riskAvg) / 100) * 20)
  );

  // 4) 準備スコア 0-10（面接練習・ポートフォリオなど）
  const prep =
    typeof prepScore === "number" ? Math.max(0, Math.min(10, prepScore)) : 5;

  const total = Math.round(skillScore + jobScore + riskScore + prep);

  let level: ReadinessScoreResult["level"] = "medium";
  let comment: string;

  if (locale === "en") {
    if (total >= 75) {
      level = "high";
      comment =
        "You look ready to start a job search right away. You can begin applying to selected roles while continuing interview practice in parallel.";
    } else if (total >= 45) {
      level = "medium";
      comment =
        "You’re in a workable position to start a job search, but it’s safer to strengthen your skills a bit more and organise your portfolio. Use the 30‑day roadmap as a concrete preparation plan.";
    } else {
      level = "low";
      comment =
        "You’re still in the foundation-building phase. Rather than rushing into applications, it’s better to spend 1–2 months focusing on skill growth and portfolio improvements first.";
    }
  } else {
    if (total >= 75) {
      level = "high";
      comment =
        "今すぐにでも転職活動を始められる準備レベルです。興味のある求人に応募しつつ、面接対策を並行して進めると良さそうです。";
    } else if (total >= 45) {
      level = "medium";
      comment =
        "転職活動を始める前提としては悪くありませんが、もう少しスキルの底上げやアウトプットの整理をしておくと安心です。30日プランを意識して準備を進めましょう。";
    } else {
      level = "low";
      comment =
        "まだ土台作りの段階です。すぐに転職活動を始めるよりも、まずは 1〜2 ヶ月かけてスキル強化とポートフォリオ整備に集中するのがおすすめです。";
    }
  }

  return { score: total, level, comment };
}


