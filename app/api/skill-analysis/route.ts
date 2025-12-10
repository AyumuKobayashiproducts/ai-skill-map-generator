import { NextRequest, NextResponse } from "next/server";
import { createOpenAIClient } from "@/lib/openaiClient";
import {
  SkillInput,
  SkillMapOutput,
  SummaryItem,
  AdvancedInsights,
} from "@/types/skillGenerator";

/**
 * スキルからスコアを計算
 */
function calculateScore(skill: SkillInput): number {
  // 経験年数とレベルを組み合わせてスコア計算
  const experienceWeight = Math.min(skill.yearsOfExperience / 10, 1) * 40;
  const levelWeight = (skill.level / 5) * 60;
  return Math.round(experienceWeight + levelWeight);
}

/**
 * ローカルでサマリーを生成（AI呼び出しなし）
 */
function generateLocalSummary(skills: SkillInput[]): {
  strengths: SummaryItem[];
  weaknesses: SummaryItem[];
  nextFocus: SummaryItem[];
} {
  const sortedByScore = [...skills].sort(
    (a, b) => calculateScore(b) - calculateScore(a)
  );

  const strengths: SummaryItem[] = sortedByScore.slice(0, 3).map((s) => ({
    title: s.name,
    description: `${s.yearsOfExperience}+ years of experience with ${
      s.level >= 4 ? "advanced" : "solid"
    } proficiency`,
  }));

  const weaknesses: SummaryItem[] = sortedByScore
    .slice(-3)
    .reverse()
    .map((s) => ({
      title: s.name,
      description: `Consider deepening your ${s.name} skills for career advancement`,
    }));

  const nextFocus: SummaryItem[] = [
    {
      title: "Deepen Core Skills",
      description: `Focus on advancing your ${sortedByScore[0]?.name || "primary"} expertise`,
    },
    {
      title: "Address Gaps",
      description: `Invest time in improving ${sortedByScore[sortedByScore.length - 1]?.name || "weaker areas"}`,
    },
    {
      title: "Expand Horizontally",
      description: "Consider adjacent skills that complement your strengths",
    },
  ];

  return { strengths, weaknesses, nextFocus };
}

/**
 * AI でより詳細なサマリーを生成
 */
async function generateAISummary(
  skills: SkillInput[]
): Promise<{
  strengths: SummaryItem[];
  weaknesses: SummaryItem[];
  nextFocus: SummaryItem[];
} | null> {
  if (!process.env.OPENAI_API_KEY) return null;

  try {
    const openai = createOpenAIClient();
    const skillsDescription = skills
      .map(
        (s) =>
          `${s.name}: ${s.yearsOfExperience} years, level ${s.level}/5`
      )
      .join("\n");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a career advisor. Analyze the given skills and provide insights.
Return a JSON object with this exact structure:
{
  "strengths": [{"title": "skill name", "description": "brief insight"}],
  "weaknesses": [{"title": "area", "description": "brief suggestion"}],
  "nextFocus": [{"title": "action", "description": "brief recommendation"}]
}
Each array should have exactly 3 items. Be concise and actionable.`,
        },
        {
          role: "user",
          content: `Analyze these skills:\n${skillsDescription}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return null;

    return JSON.parse(content);
  } catch (error) {
    console.error("AI summary generation failed:", error);
    return null;
  }
}

/**
 * Advanced Insights を生成
 */
async function generateAdvancedInsights(
  skills: SkillInput[]
): Promise<AdvancedInsights | null> {
  if (!process.env.OPENAI_API_KEY) return null;

  try {
    const openai = createOpenAIClient();
    const skillsDescription = skills
      .map(
        (s) =>
          `${s.name}: ${s.yearsOfExperience} years, level ${s.level}/5`
      )
      .join("\n");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a career advisor providing detailed skill analysis.
Return a JSON object with:
{
  "scoreBreakdown": { "skillName": { "score": 0-100, "percentile": "Top X%" } },
  "learningRoadmap": [{ "week": 1, "skill": "name", "action": "what to do", "resource": "optional link/resource" }],
  "estimatedHours": number,
  "practiceProjects": [{ "title": "name", "description": "brief", "difficulty": "beginner|intermediate|advanced", "skills": ["skill1"] }],
  "longFormAnalysis": "2-3 paragraphs of detailed career advice"
}
Provide 4-6 roadmap steps, 2-3 practice projects.`,
        },
        {
          role: "user",
          content: `Provide advanced insights for:\n${skillsDescription}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return null;

    return JSON.parse(content);
  } catch (error) {
    console.error("Advanced insights generation failed:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { skills } = body as { skills: SkillInput[] };

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return NextResponse.json(
        { success: false, error: "No skills provided" },
        { status: 400 }
      );
    }

    // スコア計算
    const skillScores = skills.map((skill) => ({
      name: skill.name,
      rawScore: calculateScore(skill),
      normalizedScore: calculateScore(skill),
      category: calculateScore(skill) >= 70
        ? "strength"
        : calculateScore(skill) <= 40
        ? "weakness"
        : "moderate",
    }));

    // レーダーチャートデータ
    const radar = {
      labels: skills.map((s) => s.name),
      data: skillScores.map((s) => s.rawScore),
    };

    // サマリー生成（AI優先、フォールバックあり）
    const aiSummary = await generateAISummary(skills);
    const summary = aiSummary || generateLocalSummary(skills);

    // Advanced Insights（オプション）
    const advanced = await generateAdvancedInsights(skills);

    const result: SkillMapOutput = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      skills: skillScores as SkillMapOutput["skills"],
      radar,
      summary,
      advanced: advanced || undefined,
    };

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Skill analysis error:", error);
    return NextResponse.json(
      { success: false, error: "Analysis failed" },
      { status: 500 }
    );
  }
}
