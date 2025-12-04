import { PortfolioGeneratorSection } from "@/components/PortfolioGeneratorSection";

export default function PortfolioPage() {
  return (
    <div className="space-y-6">
      <header className="animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-white text-2xl shadow-lg shadow-amber-500/25">
            📁
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              ポートフォリオ棚卸しジェネレーター
            </h2>
            <p className="text-sm text-slate-500">
              プロジェクトを整理して魅力的なポートフォリオを作成
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-700 leading-relaxed max-w-2xl">
          自分のプロジェクトを入力すると、
          ポートフォリオに載せるべき案件 TOP3 と紹介文を AI が提案します。
          転職活動や面接準備にお役立てください。
        </p>
      </header>
      <PortfolioGeneratorSection />
    </div>
  );
}
