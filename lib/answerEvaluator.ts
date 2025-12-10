/**
 * 面接回答の品質をルールベースで評価する
 * AIのフィードバックと組み合わせて使用することで、より客観的な評価を提供
 */

export type AnswerEvaluationResult = {
  // 0-100のスコア
  overallScore: number;
  // 各項目のスコア (0-100)
  scores: {
    length: number; // 文字数の適切さ
    specificity: number; // 具体性（数字やエピソードの有無）
    structure: number; // 構造の明確さ
    starElements: number; // STAR要素の含有率
  };
  // 検出されたポジティブな要素
  positives: string[];
  // 改善が必要な点
  improvements: string[];
};

type InterviewType = "general" | "technical" | "behavioral";

// 理想的な文字数の範囲（面接タイプ別）
const IDEAL_LENGTH: Record<InterviewType, { min: number; max: number }> = {
  general: { min: 150, max: 400 },
  technical: { min: 200, max: 500 },
  behavioral: { min: 250, max: 600 }
};

// STAR要素の検出パターン
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

// 具体性を示すパターン
const SPECIFICITY_PATTERNS = [
  /\d+(?:人|名|件|個|回|時間|日|週|ヶ月|年|%|倍)/,
  /具体的(?:に|には)/,
  /例えば|たとえば/,
  /実際(?:に|には)/
];

// 構造を示すパターン
const STRUCTURE_PATTERNS = [
  /まず|最初に|第一に/,
  /次に|その後|続いて|第二に/,
  /最終的に|結果として|結論として/,
  /理由(?:は|として)/,
  /なぜなら|というのも/
];

/**
 * 回答を評価する
 */
export function evaluateAnswer(
  answer: string,
  interviewType: InterviewType
): AnswerEvaluationResult {
  const positives: string[] = [];
  const improvements: string[] = [];

  // 1. 文字数の評価
  const lengthScore = evaluateLength(answer, interviewType, positives, improvements);

  // 2. 具体性の評価
  const specificityScore = evaluateSpecificity(answer, positives, improvements);

  // 3. 構造の評価
  const structureScore = evaluateStructure(answer, positives, improvements);

  // 4. STAR要素の評価（特に行動面接で重要）
  const starScore = evaluateStarElements(
    answer,
    interviewType,
    positives,
    improvements
  );

  // 総合スコアの計算（面接タイプによって重み付けを変える）
  let overallScore: number;
  if (interviewType === "behavioral") {
    // 行動面接ではSTAR要素を重視
    overallScore = Math.round(
      lengthScore * 0.15 +
        specificityScore * 0.25 +
        structureScore * 0.2 +
        starScore * 0.4
    );
  } else if (interviewType === "technical") {
    // 技術面接では具体性を重視
    overallScore = Math.round(
      lengthScore * 0.2 +
        specificityScore * 0.35 +
        structureScore * 0.25 +
        starScore * 0.2
    );
  } else {
    // 一般面接ではバランス重視
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
  let score = 50; // 基本スコア

  // 数字の使用をチェック
  const hasNumbers = /\d+/.test(answer);
  if (hasNumbers) {
    score += 20;
    positives.push("具体的な数字を使っています");
  } else {
    improvements.push("具体的な数字（期間、人数、成果など）を入れると説得力が増します");
  }

  // 具体性パターンのマッチ数をカウント
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
  let score = 40; // 基本スコア

  // 構造パターンのマッチ数をカウント
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

  // 改行や句読点による段落分けをチェック
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

  // 各STAR要素をチェック
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

  // スコア計算
  let score = elementCount * 25;

  // 行動面接では特にSTARを重視
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
    // 他の面接タイプでもSTAR要素があれば評価
    if (elementCount >= 3) {
      positives.push("エピソードが具体的に構成されています");
    } else if (elementCount >= 2) {
      // 特にコメントしない
    } else if (elementCount <= 1) {
      improvements.push("具体的なエピソード（状況→行動→結果）を加えると良いでしょう");
    }
  }

  return Math.min(100, score);
}

/**
 * スコアをレベル（1-5）に変換
 */
export function scoreToLevel(score: number): number {
  if (score >= 90) return 5;
  if (score >= 75) return 4;
  if (score >= 55) return 3;
  if (score >= 35) return 2;
  return 1;
}

/**
 * スコアに応じたラベルを返す
 */
export function scoreToLabel(score: number): string {
  if (score >= 90) return "素晴らしい";
  if (score >= 75) return "良い";
  if (score >= 55) return "まずまず";
  if (score >= 35) return "改善の余地あり";
  return "要練習";
}











