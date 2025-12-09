import { z } from "zod";
import type { Locale } from "@/src/i18n/config";

export const SkillCategoriesSchema = z.object({
  frontend: z.number().int().min(0).max(5).optional(),
  backend: z.number().int().min(0).max(5).optional(),
  infra: z.number().int().min(0).max(5).optional(),
  ai: z.number().int().min(0).max(5).optional(),
  tools: z.number().int().min(0).max(5).optional()
});

// 共通で使う UUID スキーマ
const UuidSchema = z.string().uuid();

// --------- generate ----------

export const GenerateRequestSchema = z.object({
  text: z.string().min(1),
  repoUrl: z.string().url().optional(),
  goal: z.string().optional(),
  userId: UuidSchema.optional(),
  locale: z.custom<Locale>().optional()
});

export const GenerateResponseSchema = z.object({
  categories: SkillCategoriesSchema,
  strengths: z.string(),
  weaknesses: z.string(),
  nextSkills: z.array(z.string()).optional(),
  roadmap30: z.string(),
  roadmap90: z.string(),
  chartData: z.object({
    labels: z.array(z.string()),
    data: z.array(z.number())
  })
});

// --------- readiness ----------

export const ReadinessRequestSchema = z.object({
  skillMapId: UuidSchema,
  jobMatchScore: z.number().min(0).max(100).optional(),
  riskObsolescence: z.number().min(0).max(100).optional(),
  riskBusFactor: z.number().min(0).max(100).optional(),
  riskAutomation: z.number().min(0).max(100).optional(),
  prepScore: z.number().min(0).max(10).optional(),
  locale: z.custom<Locale>().optional()
});

// --------- job-match ----------

export const JobMatchRequestSchema = z
  .object({
    skillMapId: UuidSchema,
    jdText: z.string().min(1).optional(),
    jobUrl: z.string().url().optional()
  })
  .refine(
    (v) => !!v.jdText || !!v.jobUrl,
    { message: "jdText か jobUrl のどちらかは必須です。" }
  );

// --------- risk ----------

export const RiskRequestSchema = z.object({
  skillMapId: UuidSchema
});

// --------- oneonone (転職面接練習) ----------

export const InterviewTypeSchema = z.enum(["general", "technical", "behavioral"]);

export const OneOnOneQuestionsRequestSchema = z.object({
  skillMapId: UuidSchema,
  interviewType: InterviewTypeSchema.optional().default("general")
});

export const OneOnOneFeedbackRequestSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  strengths: z.string().optional(),
  weaknesses: z.string().optional(),
  interviewType: InterviewTypeSchema.optional().default("general")
});

// --------- time-simulate ----------

export const TimeSimulateRequestSchema = z.object({
  skillMapId: UuidSchema,
  weekdayHours: z.number().min(0),
  weekendHours: z.number().min(0),
  months: z.number().min(1)
});

// --------- portfolio ----------

const PortfolioInputItemSchema = z.object({
  title: z.string().optional(),
  url: z.string().url().optional(),
  description: z.string().optional()
});

export const PortfolioRequestSchema = z.object({
  items: z.array(PortfolioInputItemSchema).min(1)
});

// --------- today-task ----------

export const TodayTaskRequestSchema = z.object({
  skillMapId: UuidSchema,
  hours: z.number().min(0.25).max(24)
});

// --------- coach ----------

const ChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string()
});

export const CoachRequestSchema = z.object({
  messages: z.array(ChatMessageSchema).min(1),
  context: z
    .object({
      strengths: z.string().optional(),
      weaknesses: z.string().optional(),
      roadmap30: z.string().optional(),
      roadmap90: z.string().optional()
    })
    .optional()
});

// --------- story ----------

export const StoryRequestSchema = z.object({
  strengths: z.string().optional(),
  weaknesses: z.string().optional(),
  categories: SkillCategoriesSchema.optional(),
  locale: z.custom<Locale>().optional()
});

// --------- usage log ----------

export const UsageLogRequestSchema = z.object({
  event: z.string().min(1),
  userId: UuidSchema.optional(),
  meta: z.record(z.any()).optional()
});


