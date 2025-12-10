/**
 * AI Skill Generator - Simplified Type Definitions
 * シンプルな1ページSaaS向けの型定義
 */

/** スキル入力 */
export interface SkillInput {
  id: string;
  name: string;
  yearsOfExperience: number; // 0-10
  level: 1 | 2 | 3 | 4 | 5;   // 1=Beginner, 5=Expert
}

/** スキルレベルの定義 */
export const SKILL_LEVELS = {
  1: { label: "Beginner", color: "#94a3b8" },
  2: { label: "Elementary", color: "#60a5fa" },
  3: { label: "Intermediate", color: "#34d399" },
  4: { label: "Advanced", color: "#fbbf24" },
  5: { label: "Expert", color: "#f472b6" },
} as const;

/** 計算されたスキルスコア */
export interface SkillScore {
  name: string;
  rawScore: number;        // 0-100
  normalizedScore: number; // レーダー用
  category: "strength" | "weakness" | "moderate";
}

/** サマリーアイテム */
export interface SummaryItem {
  title: string;
  description: string;
}

/** 生成結果 */
export interface SkillMapOutput {
  id: string;
  createdAt: string;
  skills: SkillScore[];
  radar: {
    labels: string[];
    data: number[];
  };
  summary: {
    strengths: SummaryItem[];
    weaknesses: SummaryItem[];
    nextFocus: SummaryItem[];
  };
  advanced?: AdvancedInsights;
}

/** Advanced Insights */
export interface AdvancedInsights {
  scoreBreakdown: Record<string, {
    score: number;
    percentile: string;
  }>;
  learningRoadmap: RoadmapStep[];
  estimatedHours: number;
  practiceProjects: ProjectSuggestion[];
  longFormAnalysis: string;
}

/** ロードマップステップ */
export interface RoadmapStep {
  week: number;
  skill: string;
  action: string;
  resource?: string;
}

/** プロジェクト提案 */
export interface ProjectSuggestion {
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  skills: string[];
}

/** API リクエスト */
export interface GenerateSkillMapRequest {
  skills: SkillInput[];
  locale?: "en" | "ja";
}

/** API レスポンス */
export interface GenerateSkillMapResponse {
  success: boolean;
  data?: SkillMapOutput;
  error?: string;
}

/** デフォルトのスキル入力 */
export const DEFAULT_SKILL: SkillInput = {
  id: "",
  name: "",
  yearsOfExperience: 1,
  level: 2,
};

/** サンプルスキル（デモ用） */
export const SAMPLE_SKILLS: SkillInput[] = [
  { id: "1", name: "React", yearsOfExperience: 3, level: 4 },
  { id: "2", name: "TypeScript", yearsOfExperience: 2, level: 3 },
  { id: "3", name: "Node.js", yearsOfExperience: 2, level: 3 },
  { id: "4", name: "Python", yearsOfExperience: 1, level: 2 },
  { id: "5", name: "AWS", yearsOfExperience: 1, level: 2 },
];

