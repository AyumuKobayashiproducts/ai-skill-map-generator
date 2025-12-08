import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { SkillForm } from "@/components/SkillForm";
import { DemoGuideBanner } from "@/components/DemoGuideBanner";

// 静的生成を無効化（next-intl が headers を使用するため）
export const dynamic = "force-dynamic";

interface HomePageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const t = await getTranslations("home");
  const isDemo = searchParams?.demo === "1";

  const heroLead = t.rich("hero.lead", {
    strong: (chunks) => <strong className="font-semibold">{chunks}</strong>
  });

  const howToBody = t.rich("guide.howToBody", {
    strong: (chunks) => <strong className="font-semibold">{chunks}</strong>
  });

  return (
    <div className="space-y-8">
      <section className="space-y-4 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-sky-100 to-indigo-100 text-sky-700 text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
          {t("badge")}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
          {t("hero.titleLine1")}
          <br />
          <span className="gradient-text">
            {t("hero.titleLine2")}
          </span>
        </h1>
        <p className="text-base md:text-lg text-slate-600 max-w-2xl leading-relaxed">
          {heroLead}
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{t("hero.badgeFree")}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{t("hero.badgeMailOnly")}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{t("hero.badgeFast")}</span>
          </div>
        </div>
      </section>

      <section className="space-y-4 animate-fade-in-up stagger-2">
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            {t("steps.label")}
          </p>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((step, idx) => {
            const itemTitle = t(`steps.items.${idx}.title`);
            const itemDesc = t(`steps.items.${idx}.desc`);
            const icons = ["🎯", "✍️", "📊"] as const;
            const icon = icons[idx] ?? "✨";
            return (
            <div
              key={step}
              className={`group relative rounded-xl border-2 border-slate-200 bg-white px-5 py-6 shadow-sm card-hover animate-fade-in-up stagger-${idx + 3} hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100 transition-all duration-300`}
            >
              <div className="absolute -top-4 -left-2 w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 via-indigo-500 to-purple-500 flex items-center justify-center text-white text-base font-bold shadow-lg shadow-sky-500/40 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                {step}
              </div>
              <div className="mt-2">
                <p className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
                  <span className="text-2xl">{icon}</span>
                  {itemTitle}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {itemDesc}
                </p>
              </div>
            </div>
          );})}
        </div>
      </section>

      {/* はじめての方へガイド */}
      <section className="animate-fade-in-up stagger-3">
        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-5 shadow-md">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center text-white text-xl flex-shrink-0">
              👋
            </div>
            <div className="flex-1">
              <p className="text-base font-bold text-slate-900 mb-1">
                {t("guide.title")}
              </p>
              <p className="text-sm text-slate-600">
                {t("guide.description")}
              </p>
            </div>
          </div>
          <div className="space-y-3 text-sm text-slate-700">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/80 border border-slate-200">
              <span className="text-lg flex-shrink-0">💡</span>
              <div>
                <p className="font-semibold text-slate-900 mb-1">
                  {t("guide.howToTitle")}
                </p>
                <p className="text-xs md:text-sm leading-relaxed">
                  {howToBody}
                </p>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 text-xs">
              <div className="flex items-start gap-2 p-2 rounded-lg bg-white/60">
                <span className="text-sm">📊</span>
                <div>
                  <Link href="/dashboard" className="font-semibold text-sky-700 hover:underline">
                    {t("guide.dashboardLink")}
                  </Link>
                  <span className="text-slate-600">
                    {" "}{t("guide.dashboardText")}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2 p-2 rounded-lg bg-white/60">
                <span className="text-sm">ℹ️</span>
                <div>
                  <Link href="/about" className="font-semibold text-sky-700 hover:underline">
                    {t("guide.aboutLink")}
                  </Link>
                  <span className="text-slate-600">
                    {" "}{t("guide.aboutText")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-start animate-fade-in-up stagger-5">
        <div className="space-y-5">
          <div>
            <p className="font-bold text-slate-900 text-base mb-1 flex items-center gap-2">
              <span className="text-lg">✨</span>
              {t("features.title")}
            </p>
            <p className="text-xs text-slate-600">
              {t("features.subtitle")}
            </p>
          </div>
          <ul className="space-y-3">
            {t("features.items")
              .split("|")
              .map((text, index) => {
              const icons = ["🗺️", "📅", "💼", "🎤", "📄"] as const;
              const colors = [
                "from-sky-500 to-indigo-500",
                "from-indigo-500 to-purple-500",
                "from-purple-500 to-pink-500",
                "from-pink-500 to-rose-500",
                "from-rose-500 to-orange-500"
              ];
              const icon = icons[index] ?? "✨";
              const color = colors[index] ?? "from-slate-500 to-slate-700";
              return (
              <li key={text} className="group flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all duration-200">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 text-white text-base group-hover:scale-110 transition-transform shadow-sm`}>
                  {icon}
                </div>
                <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors leading-relaxed pt-1">
                  {text}
                </span>
              </li>
            );})}
          </ul>
        </div>

        <div className="rounded-2xl border-2 border-slate-300 bg-white shadow-2xl shadow-slate-400/30 overflow-hidden animate-scale-in stagger-6">
          <div className="border-b-2 border-slate-200 bg-gradient-to-r from-slate-50 via-white to-sky-50 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
                ✍️
              </div>
              <span className="font-bold text-slate-900 text-sm">
                {t("formHeader.title")}
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 text-white text-xs font-semibold shadow-md">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              {t("formHeader.badge")}
            </span>
          </div>
          <div className="p-5 sm:p-6 bg-gradient-to-br from-white via-slate-50 to-sky-50/30">
            <SkillForm />
          </div>
        </div>
      </div>
      {isDemo && (
        <DemoGuideBanner
          step={1}
          title={t("demoGuide.title")}
          description={
          <>{t("demoGuide.description")}</>
          }
        />
      )}
    </div>
  );
}
