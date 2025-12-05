/**
 * interview-answer-evaluator
 *
 * Rule-based evaluation of interview answers with STAR method analysis.
 * Designed for Japanese language but can be extended for other languages.
 *
 * @example
 * ```typescript
 * import { evaluateAnswer, scoreToLevel, scoreToLabel } from 'interview-answer-evaluator';
 *
 * const result = evaluateAnswer(
 *   "私は3年間のプロジェクトで、チームリーダーとして10名のメンバーを率い、売上を20%向上させました。",
 *   "behavioral"
 * );
 *
 * console.log(result.overallScore); // 0-100
 * console.log(result.positives);    // ["STAR法の要素が含まれています", ...]
 * console.log(result.improvements); // ["具体的な数字を入れると説得力が増します", ...]
 * ```
 */

export type InterviewType = "general" | "technical" | "behavioral";

export type AnswerEvaluationResult = {
  /** Overall score from 0-100 */
  overallScore: number;
  /** Individual scores for each evaluation criteria */
  scores: {
    /** Appropriateness of answer length */
    length: number;
    /** Presence of specific examples, numbers, etc. */
    specificity: number;
    /** Logical structure of the answer */
    structure: number;
    /** STAR method elements (Situation, Task, Action, Result) */
    starElements: number;
  };
  /** Positive aspects detected in the answer */
  positives: string[];
  /** Areas that need improvement */
  improvements: string[];
};

// Ideal length ranges by interview type
const IDEAL_LENGTH: Record<InterviewType, { min: number; max: number }> = {
  general: { min: 150, max: 400 },
  technical: { min: 200, max: 500 },
  behavioral: { min: 250, max: 600 }
};

// STAR element detection patterns (Japanese)
const STAR_PATTERNS = {
  situation: [
    /当時|その頃|プロジェクト(?:で|の)|チーム(?:で|の)|環境|背景|状況/,
    /年前|年目|入社/,
    /規模|人数|メンバー/
  ],
  task: [
    /課題|問題|目標|ゴール|目的|解決すべき|求められ/,
    /必要(?:だった|でした|があ)/,
    /〜する(?:必要|ため)/
  ],
  action: [
    /私(?:は|が)|自分(?:は|が)|私自身/,
    /実施|実行|取り組|行い|行った|対応|提案|導入|設計|実装/,
    /判断|決定|選択|検討/
  ],
  result: [
    /結果|成果|効果|改善|向上|削減|達成/,
    /\d+%|〇〇%|約\d+/,
    /できた|できました|なりました|しました$/
  ]
};

// Specificity patterns
const SPECIFICITY_PATTERNS = [
  /\d+(?:人|名|件|個|回|時間|日|週|ヶ月|年|%|倍)/,
  /具体的(?:に|には)/,
  /例えば|たとえば/,
  /実際(?:に|には)/
];

// Structure patterns
const STRUCTURE_PATTERNS = [
  /まず|最初に|第一に/,
  /次に|その後|続いて|第二に/,
  /最終的に|結果として|結論として/,
  /理由(?:は|として)/,
  /なぜなら|というのも/
];

/**
 * Evaluate an interview answer using rule-based analysis
 *
 * @param answer - The answer text to evaluate
 * @param interviewType - Type of interview (general, technical, behavioral)
 * @returns Evaluation result with scores and feedback
 */
export function evaluateAnswer(
  answer: string,
  interviewType: InterviewType
): AnswerEvaluationResult {
  const positives: string[] = [];
  const improvements: string[] = [];

  // 1. Length evaluation
  const lengthScore = evaluateLength(answer, interviewType, positives, improvements);

  // 2. Specificity evaluation
  const specificityScore = evaluateSpecificity(answer, positives, improvements);

  // 3. Structure evaluation
  const structureScore = evaluateStructure(answer, positives, improvements);

  // 4. STAR elements evaluation
  const starScore = evaluateStarElements(
    answer,
    interviewType,
    positives,
    improvements
  );

  // Calculate overall score with type-specific weights
  let overallScore: number;
  if (interviewType === "behavioral") {
    // Behavioral interviews emphasize STAR elements
    overallScore = Math.round(
      lengthScore * 0.15 +
        specificityScore * 0.25 +
        structureScore * 0.2 +
        starScore * 0.4
    );
  } else if (interviewType === "technical") {
    // Technical interviews emphasize specificity
    overallScore = Math.round(
      lengthScore * 0.2 +
        specificityScore * 0.35 +
        structureScore * 0.25 +
        starScore * 0.2
    );
  } else {
    // General interviews have balanced weights
    overallScore = Math.round(
      lengthScore * 0.25 +
        specificityScore * 0.3 +
        structureScore * 0.25 +
        starScore * 0.2
    );
  }

  return {
    overallScore,
    scores: {
      length: lengthScore,
      specificity: specificityScore,
      structure: structureScore,
      starElements: starScore
    },
    positives,
    improvements
  };
}

function evaluateLength(
  answer: string,
  interviewType: InterviewType,
  positives: string[],
  improvements: string[]
): number {
  const length = answer.length;
  const { min, max } = IDEAL_LENGTH[interviewType];

  if (length >= min && length <= max) {
    positives.push("回答の長さが適切です");
    return 100;
  } else if (length < min * 0.5) {
    improvements.push("回答が短すぎます。もう少し具体的に説明しましょう");
    return 30;
  } else if (length < min) {
    improvements.push("もう少し詳しく説明すると良いでしょう");
    return 60;
  } else if (length > max * 1.5) {
    improvements.push("回答が長すぎます。要点を絞って簡潔にしましょう");
    return 50;
  } else if (length > max) {
    improvements.push("少し長めです。要点を絞ると良いでしょう");
    return 75;
  }

  return 70;
}

function evaluateSpecificity(
  answer: string,
  positives: string[],
  improvements: string[]
): number {
  let score = 50;

  // Check for numbers
  const hasNumbers = /\d+/.test(answer);
  if (hasNumbers) {
    score += 20;
    positives.push("具体的な数字を使っています");
  } else {
    improvements.push("具体的な数字（期間、人数、成果など）を入れると説得力が増します");
  }

  // Count specificity pattern matches
  let specificityMatches = 0;
  for (const pattern of SPECIFICITY_PATTERNS) {
    if (pattern.test(answer)) {
      specificityMatches++;
    }
  }

  if (specificityMatches >= 2) {
    score += 30;
    positives.push("具体的なエピソードや例が含まれています");
  } else if (specificityMatches === 1) {
    score += 15;
  } else {
    improvements.push("具体的なエピソードや例を加えると良いでしょう");
  }

  return Math.min(100, score);
}

function evaluateStructure(
  answer: string,
  positives: string[],
  improvements: string[]
): number {
  let score = 40;

  // Count structure pattern matches
  let structureMatches = 0;
  for (const pattern of STRUCTURE_PATTERNS) {
    if (pattern.test(answer)) {
      structureMatches++;
    }
  }

  if (structureMatches >= 3) {
    score += 60;
    positives.push("論理的な構造で説明できています");
  } else if (structureMatches >= 2) {
    score += 40;
    positives.push("回答に構造があります");
  } else if (structureMatches === 1) {
    score += 20;
  } else {
    improvements.push("「まず〜、次に〜、結果として〜」のような構造を意識すると良いでしょう");
  }

  // Check for paragraphs
  const hasParagraphs = answer.includes("\n") || answer.split("。").length >= 3;
  if (hasParagraphs) {
    score += 10;
  }

  return Math.min(100, score);
}

function evaluateStarElements(
  answer: string,
  interviewType: InterviewType,
  positives: string[],
  improvements: string[]
): number {
  const foundElements: string[] = [];

  // Check each STAR element
  for (const [element, patterns] of Object.entries(STAR_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(answer)) {
        foundElements.push(element);
        break;
      }
    }
  }

  const uniqueElements = [...new Set(foundElements)];
  const elementCount = uniqueElements.length;

  // Calculate score
  let score = elementCount * 25;

  // Behavioral interviews especially emphasize STAR
  if (interviewType === "behavioral") {
    if (elementCount === 4) {
      positives.push("STAR法の4要素（状況・課題・行動・結果）がすべて含まれています");
      score = 100;
    } else if (elementCount >= 3) {
      positives.push(`STAR法の${elementCount}要素が含まれています`);
      const missing = ["situation", "task", "action", "result"].filter(
        (e) => !uniqueElements.includes(e)
      );
      const missingLabels: Record<string, string> = {
        situation: "状況",
        task: "課題",
        action: "行動",
        result: "結果"
      };
      improvements.push(
        `STAR法の「${missing.map((m) => missingLabels[m]).join("・")}」を追加すると良いでしょう`
      );
    } else {
      improvements.push("STAR法（状況→課題→行動→結果）を意識して構成しましょう");
    }
  } else {
    // Other interview types also benefit from STAR elements
    if (elementCount >= 3) {
      positives.push("エピソードが具体的に構成されています");
    } else if (elementCount <= 1) {
      improvements.push("具体的なエピソード（状況→行動→結果）を加えると良いでしょう");
    }
  }

  return Math.min(100, score);
}

/**
 * Convert a score (0-100) to a level (1-5)
 *
 * @param score - Score from 0 to 100
 * @returns Level from 1 to 5
 */
export function scoreToLevel(score: number): number {
  if (score >= 90) return 5;
  if (score >= 75) return 4;
  if (score >= 55) return 3;
  if (score >= 35) return 2;
  return 1;
}

/**
 * Convert a score to a human-readable label (Japanese)
 *
 * @param score - Score from 0 to 100
 * @returns Label describing the score level
 */
export function scoreToLabel(score: number): string {
  if (score >= 90) return "素晴らしい";
  if (score >= 75) return "良い";
  if (score >= 55) return "まずまず";
  if (score >= 35) return "改善の余地あり";
  return "要練習";
}

// Note: InterviewType and AnswerEvaluationResult are already exported above

