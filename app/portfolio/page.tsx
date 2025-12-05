import { PortfolioGeneratorSection } from "@/components/PortfolioGeneratorSection";

export default function PortfolioPage() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold mb-2">
          ポートフォリオ棚卸しジェネレーター
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          自分のプロジェクトを入力すると、
          ポートフォリオに載せるべき案件 TOP3 と紹介文を AI が提案します。
        </p>
      </section>
      <PortfolioGeneratorSection />
    </div>
  );
}


