import { describe, it, expect } from "vitest";
import { evaluateAnswer, scoreToLevel, scoreToLabel } from "./answerEvaluator";

/**
 * エッジケースとエラーハンドリングのテスト
 */
describe("evaluateAnswer - エッジケース", () => {
  describe("空入力", () => {
    it("空文字列でもクラッシュしない", () => {
      const result = evaluateAnswer("", "general");
      expect(result.overallScore).toBeGreaterThanOrEqual(0);
      expect(result.overallScore).toBeLessThanOrEqual(100);
      expect(result.improvements.length).toBeGreaterThan(0);
    });

    it("空白のみの入力でも正しく処理される", () => {
      const result = evaluateAnswer("   \n\t  ", "general");
      expect(result.overallScore).toBeLessThan(50);
    });
  });

  describe("極端に長い入力", () => {
    it("非常に長い回答でも正しく処理される", () => {
      const longAnswer = "私は " + "テスト ".repeat(500);
      const result = evaluateAnswer(longAnswer, "general");
      expect(result.overallScore).toBeGreaterThanOrEqual(0);
      expect(result.improvements.some((i) => i.includes("長"))).toBe(true);
    });
  });

  describe("特殊文字を含む入力", () => {
    it("絵文字を含む回答も処理できる", () => {
      const answer = "私は🎉エンジニアとして3年間働き、売上を📈20%向上させました。";
      const result = evaluateAnswer(answer, "general");
      expect(result.overallScore).toBeGreaterThan(0);
    });

    it("HTMLタグを含む回答も処理できる", () => {
      const answer =
        "<script>alert('test')</script>私はエンジニアとして働いています。";
      const result = evaluateAnswer(answer, "general");
      expect(result.overallScore).toBeGreaterThanOrEqual(0);
    });

    it("改行を多く含む回答も処理できる", () => {
      const answer = `
        私は3年間エンジニアとして働いています。
        
        まず、フロントエンド開発を担当しました。
        
        次に、バックエンド開発も経験しました。
        
        結果として、フルスタックな開発ができるようになりました。
      `;
      const result = evaluateAnswer(answer, "general");
      expect(result.overallScore).toBeGreaterThan(40);
    });
  });

  describe("面接タイプ別の境界値", () => {
    const testCases = [
      { type: "general" as const, minLength: 150, maxLength: 400 },
      { type: "technical" as const, minLength: 200, maxLength: 500 },
      { type: "behavioral" as const, minLength: 250, maxLength: 600 }
    ];

    testCases.forEach(({ type, minLength, maxLength }) => {
      it(`${type}面接: 最小文字数ちょうどで高スコアになる`, () => {
        // minLength分の文字を生成（数字や構造を含む）
        const answer = `私は3年間のプロジェクトで、まず課題を分析し、次に10名のチームで改善に取り組み、結果として売上が20%向上しました。`.repeat(
          Math.ceil(minLength / 50)
        );
        const result = evaluateAnswer(answer.slice(0, minLength + 10), type);
        expect(result.scores.length).toBeGreaterThanOrEqual(60);
      });

      it(`${type}面接: 最大文字数を超えるとスコアが下がる`, () => {
        const answer = "テスト ".repeat(maxLength);
        const result = evaluateAnswer(answer, type);
        expect(result.improvements.some((i) => i.includes("長"))).toBe(true);
      });
    });
  });

  describe("STAR要素の部分マッチ", () => {
    it("Situationのみの回答でも評価される", () => {
      const answer =
        "当時のプロジェクトは5人のチームで、3ヶ月の期間で開発していました。";
      const result = evaluateAnswer(answer, "behavioral");
      expect(result.scores.starElements).toBeGreaterThan(0);
    });

    it("Resultのみの回答でも評価される", () => {
      const answer = "結果として、売上が30%向上し、目標を達成できました。";
      const result = evaluateAnswer(answer, "behavioral");
      expect(result.scores.starElements).toBeGreaterThan(0);
    });

    it("ActionとResultが揃うと高スコアになる", () => {
      const answer = `
        私は問題を分析し、解決策を提案しました。
        実際にコードを実装し、チームに共有しました。
        結果として、処理速度が50%改善しました。
      `;
      const result = evaluateAnswer(answer, "behavioral");
      expect(result.scores.starElements).toBeGreaterThan(40);
    });
  });

  describe("日本語パターンのバリエーション", () => {
    it("敬語調でも正しく評価される", () => {
      const answer = `
        私は3年間、Webエンジニアとして従事してまいりました。
        主にフロントエンド開発を担当させていただき、
        ReactとTypeScriptを用いたSPA開発に取り組んでおりました。
        結果といたしまして、ページ表示速度を40%改善することができました。
      `;
      const result = evaluateAnswer(answer, "general");
      expect(result.overallScore).toBeGreaterThan(50);
    });

    it("カジュアルな口調でも正しく評価される", () => {
      const answer = `
        3年くらいエンジニアやってます。
        ReactとかTypeScriptとか使って開発してて、
        最近だとパフォーマンス改善で40%くらい速くできました。
      `;
      const result = evaluateAnswer(answer, "general");
      expect(result.overallScore).toBeGreaterThan(30);
    });
  });
});

describe("scoreToLevel - 境界値", () => {
  it("ちょうど90点で5を返す", () => {
    expect(scoreToLevel(90)).toBe(5);
  });

  it("89点で4を返す", () => {
    expect(scoreToLevel(89)).toBe(4);
  });

  it("ちょうど75点で4を返す", () => {
    expect(scoreToLevel(75)).toBe(4);
  });

  it("74点で3を返す", () => {
    expect(scoreToLevel(74)).toBe(3);
  });

  it("ちょうど55点で3を返す", () => {
    expect(scoreToLevel(55)).toBe(3);
  });

  it("54点で2を返す", () => {
    expect(scoreToLevel(54)).toBe(2);
  });

  it("ちょうど35点で2を返す", () => {
    expect(scoreToLevel(35)).toBe(2);
  });

  it("34点で1を返す", () => {
    expect(scoreToLevel(34)).toBe(1);
  });

  it("0点で1を返す", () => {
    expect(scoreToLevel(0)).toBe(1);
  });

  it("100点で5を返す", () => {
    expect(scoreToLevel(100)).toBe(5);
  });

  it("負の数でも1を返す", () => {
    expect(scoreToLevel(-10)).toBe(1);
  });
});

describe("scoreToLabel - 全パターン", () => {
  it("90点以上は「素晴らしい」", () => {
    expect(scoreToLabel(90)).toBe("素晴らしい");
    expect(scoreToLabel(100)).toBe("素晴らしい");
  });

  it("75-89点は「良い」", () => {
    expect(scoreToLabel(75)).toBe("良い");
    expect(scoreToLabel(89)).toBe("良い");
  });

  it("55-74点は「まずまず」", () => {
    expect(scoreToLabel(55)).toBe("まずまず");
    expect(scoreToLabel(74)).toBe("まずまず");
  });

  it("35-54点は「改善の余地あり」", () => {
    expect(scoreToLabel(35)).toBe("改善の余地あり");
    expect(scoreToLabel(54)).toBe("改善の余地あり");
  });

  it("34点以下は「要練習」", () => {
    expect(scoreToLabel(34)).toBe("要練習");
    expect(scoreToLabel(0)).toBe("要練習");
  });
});











