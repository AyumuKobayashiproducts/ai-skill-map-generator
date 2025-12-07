# interview-answer-evaluator

[![npm version](https://img.shields.io/npm/v/interview-answer-evaluator.svg)](https://www.npmjs.com/package/interview-answer-evaluator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Rule-based evaluation of interview answers with STAR method analysis

A TypeScript library for evaluating interview answers using rule-based analysis. Supports general, technical, and behavioral interview types with STAR method (Situation, Task, Action, Result) detection.

**Currently optimized for Japanese language**, but can be extended for other languages.

## Features

- 📊 **Multi-criteria evaluation**: Length, specificity, structure, and STAR elements
- 🎯 **Interview type support**: General, technical, and behavioral interviews
- 🔤 **Japanese language optimized**: Built-in patterns for Japanese text analysis
- 📝 **Actionable feedback**: Returns both positive aspects and improvement suggestions
- 🧪 **Well-tested**: Comprehensive test coverage

## Installation

```bash
npm install interview-answer-evaluator
```

## Usage

```typescript
import { evaluateAnswer, scoreToLevel, scoreToLabel } from 'interview-answer-evaluator';

// Evaluate an answer
const result = evaluateAnswer(
  "私は3年間のプロジェクトで、チームリーダーとして10名のメンバーを率い、売上を20%向上させました。",
  "behavioral"
);

console.log(result.overallScore); // 0-100
console.log(result.scores);       // { length, specificity, structure, starElements }
console.log(result.positives);    // ["STAR法の要素が含まれています", ...]
console.log(result.improvements); // ["もう少し詳しく説明すると良いでしょう", ...]

// Convert score to level (1-5)
const level = scoreToLevel(result.overallScore);
console.log(level); // 4

// Get human-readable label
const label = scoreToLabel(result.overallScore);
console.log(label); // "良い"
```

## API

### `evaluateAnswer(answer: string, interviewType: InterviewType): AnswerEvaluationResult`

Evaluates an interview answer and returns detailed scores and feedback.

**Parameters:**
- `answer`: The answer text to evaluate
- `interviewType`: `"general"` | `"technical"` | `"behavioral"`

**Returns:** `AnswerEvaluationResult`
```typescript
{
  overallScore: number;  // 0-100
  scores: {
    length: number;       // Appropriateness of answer length
    specificity: number;  // Presence of specific examples, numbers
    structure: number;    // Logical structure
    starElements: number; // STAR method elements
  };
  positives: string[];    // Positive aspects
  improvements: string[]; // Areas for improvement
}
```

### `scoreToLevel(score: number): number`

Converts a score (0-100) to a level (1-5).

| Score Range | Level |
|-------------|-------|
| 90-100 | 5 |
| 75-89 | 4 |
| 55-74 | 3 |
| 35-54 | 2 |
| 0-34 | 1 |

### `scoreToLabel(score: number): string`

Returns a Japanese label for the score level.

| Score Range | Label |
|-------------|-------|
| 90-100 | 素晴らしい |
| 75-89 | 良い |
| 55-74 | まずまず |
| 35-54 | 改善の余地あり |
| 0-34 | 要練習 |

## Evaluation Weights by Interview Type

| Interview Type | Length | Specificity | Structure | STAR Elements |
|---------------|--------|-------------|-----------|---------------|
| General | 25% | 30% | 25% | 20% |
| Technical | 20% | 35% | 25% | 20% |
| Behavioral | 15% | 25% | 20% | 40% |

## Extending for Other Languages

The library uses pattern matching for analysis. To support other languages, you can fork and modify the pattern constants in the source code:

- `STAR_PATTERNS`: Patterns for detecting STAR elements
- `SPECIFICITY_PATTERNS`: Patterns for detecting specific examples
- `STRUCTURE_PATTERNS`: Patterns for detecting logical structure

## License

MIT






