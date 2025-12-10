import { describe, it, expect } from "vitest";
import {
  evaluateAnswer,
  scoreToLevel,
  scoreToLabel
} from "./answerEvaluator";

describe("evaluateAnswer", () => {
  describe("一般面接の評価", () => {
    it("短すぎる回答は低スコアになる", () => {
      const result = evaluateAnswer("はい、できます。", "general");
      expect(result.overallScore).toBeLessThan(50);
      expect(result.improvements.length).toBeGreaterThan(0);
    });

    it("適切な長さで具体性のある回答は高スコアになる", () => {
      const goodAnswer = `
        私はこれまで3年間、Webエンジニアとして働いてきました。
        特にフロントエンド開発を中心に、ReactとTypeScriptを使った
        SPAの開発を担当してきました。直近のプロジェクトでは、
        5人チームのリードとして、ECサイトのリニューアルを担当し、
        ページ表示速度を40%改善することができました。
        まず技術選定から始め、次にアーキテクチャ設計、そして
        チームメンバーへのタスク割り振りを行いました。
        結果として、予定より2週間早くリリースを達成しました。
      `;
      const result = evaluateAnswer(goodAnswer, "general");
      expect(result.overallScore).toBeGreaterThan(60);
      expect(result.positives.length).toBeGreaterThan(0);
    });

    it("数字を含む回答は具体性スコアが高くなる", () => {
      const withNumbers = "私は3年間で10件以上のプロジェクトを担当し、売上を20%向上させました。";
      const withoutNumbers = "私は長年多くのプロジェクトを担当し、売上を向上させました。";

      const resultWith = evaluateAnswer(withNumbers, "general");
      const resultWithout = evaluateAnswer(withoutNumbers, "general");

      expect(resultWith.scores.specificity).toBeGreaterThan(
        resultWithout.scores.specificity
      );
    });
  });

  describe("技術面接の評価", () => {
    it("技術的な詳細を含む回答は高スコアになる", () => {
      const technicalAnswer = `
        ReactからNext.jsへの移行を提案しました。理由は3つあります。
        まず、SEO対策としてSSRが必要だったこと。
        次に、パフォーマンス面でのISRによる静的生成のメリット。
        最後に、API Routesによるバックエンドの簡素化です。
        実装した結果、Lighthouseスコアが65から92に向上し、
        オーガニック流入が約30%増加しました。
      `;
      const result = evaluateAnswer(technicalAnswer, "technical");
      expect(result.overallScore).toBeGreaterThan(60);
    });
  });

  describe("行動面接の評価", () => {
    it("STAR要素が揃っている回答は高スコアになる", () => {
      const starAnswer = `
        【状況】前職のECサイト開発プロジェクトで、
        チームの生産性が低下している状況がありました。
        
        【課題】スプリントの達成率が60%程度で、
        リリース遅延が常態化していることが課題でした。
        
        【行動】私はまず原因分析を行い、タスクの見積もり精度が
        低いことを特定しました。その後、プランニングポーカーを
        導入し、見積もりプロセスを改善しました。
        
        【結果】3ヶ月後にはスプリント達成率が90%に向上し、
        予定通りのリリースができるようになりました。
      `;
      const result = evaluateAnswer(starAnswer, "behavioral");
      expect(result.overallScore).toBeGreaterThan(70);
      expect(result.scores.starElements).toBeGreaterThan(70);
    });

    it("STAR要素が不足している回答は低スコアになる", () => {
      const weakAnswer = "困難なプロジェクトを頑張って乗り越えました。チームで協力して成功しました。";
      const result = evaluateAnswer(weakAnswer, "behavioral");
      expect(result.scores.starElements).toBeLessThan(50);
      expect(result.improvements.some((i) => i.includes("STAR"))).toBe(true);
    });
  });

  describe("構造の評価", () => {
    it("論理的な構造を持つ回答は構造スコアが高い", () => {
      const structuredAnswer = `
        まず、私の強みについてお話しします。
        次に、これまでの経験を具体的にご紹介します。
        最後に、御社でどのように貢献できるかをお伝えします。
        
        私の強みは問題解決能力です。なぜなら、
        複雑な技術課題に対して体系的にアプローチする
        ことを心がけているからです。
      `;
      const result = evaluateAnswer(structuredAnswer, "general");
      expect(result.scores.structure).toBeGreaterThan(70);
    });
  });
});

describe("scoreToLevel", () => {
  it("90点以上は5を返す", () => {
    expect(scoreToLevel(90)).toBe(5);
    expect(scoreToLevel(100)).toBe(5);
  });

  it("75-89点は4を返す", () => {
    expect(scoreToLevel(75)).toBe(4);
    expect(scoreToLevel(89)).toBe(4);
  });

  it("55-74点は3を返す", () => {
    expect(scoreToLevel(55)).toBe(3);
    expect(scoreToLevel(74)).toBe(3);
  });

  it("35-54点は2を返す", () => {
    expect(scoreToLevel(35)).toBe(2);
    expect(scoreToLevel(54)).toBe(2);
  });

  it("34点以下は1を返す", () => {
    expect(scoreToLevel(34)).toBe(1);
    expect(scoreToLevel(0)).toBe(1);
  });
});

describe("scoreToLabel", () => {
  it("スコアに応じた適切なラベルを返す", () => {
    expect(scoreToLabel(95)).toBe("素晴らしい");
    expect(scoreToLabel(80)).toBe("良い");
    expect(scoreToLabel(60)).toBe("まずまず");
    expect(scoreToLabel(40)).toBe("改善の余地あり");
    expect(scoreToLabel(20)).toBe("要練習");
  });
});











