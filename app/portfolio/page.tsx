import { PortfolioGeneratorSection } from "@/components/PortfolioGeneratorSection";
import { getTranslations } from "next-intl/server";

export default async function PortfolioPage() {
  const t = await getTranslations("portfolio.hero");

  return (
    <div className="space-y-6">
      <header className="animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-white text-2xl shadow-lg shadow-amber-500/25">
            📁
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {t("title")}
            </h2>
            <p className="text-sm text-slate-500">
              {t("subtitle")}
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-700 leading-relaxed max-w-2xl">
          {t("intro")}
        </p>
      </header>
      <PortfolioGeneratorSection />
    </div>
  );
}
