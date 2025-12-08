import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { SkillForm } from "@/components/SkillForm";
import { DemoGuideBanner } from "@/components/DemoGuideBanner";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

interface HomePageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const t = await getTranslations("home");
  const isDemo = searchParams?.demo === "1";

  const heroLead = t.rich("hero.lead", {
    strong: (chunks) => <strong className="font-semibold text-gray-900">{chunks}</strong>
  });

  const howToBody = t.rich("guide.howToBody", {
    strong: (chunks) => <strong className="font-semibold text-gray-900">{chunks}</strong>
  });

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="space-y-6 animate-fade-in">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          {t("badge")}
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-[1.1]">
          {t("hero.titleLine1")}
          <br />
          <span className="text-gradient">{t("hero.titleLine2")}</span>
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
          {heroLead}
        </p>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          {[
            { icon: CheckIcon, label: t("hero.badgeFree") },
            { icon: CheckIcon, label: t("hero.badgeMailOnly") },
            { icon: CheckIcon, label: t("hero.badgeFast") },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm text-gray-600">
              <Icon className="w-4 h-4 text-success-500" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Steps Section */}
      <section className="space-y-6 animate-fade-in-up stagger-1">
        <div className="divider-text">
          <span>{t("steps.label")}</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((idx) => {
            const itemTitle = t(`steps.items.${idx}.title`);
            const itemDesc = t(`steps.items.${idx}.desc`);

            return (
              <Card key={idx} hover className="relative pt-8 animate-fade-in-up" style={{ animationDelay: `${(idx + 2) * 100}ms` }}>
                {/* Step number */}
                <div className="absolute -top-3 left-4 w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center text-white text-sm font-semibold">
                  {idx + 1}
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  {itemTitle}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {itemDesc}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Guide Section */}
      <section className="animate-fade-in-up stagger-2">
        <Card className="bg-gray-50 border-gray-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <InfoIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  {t("guide.title")}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {t("guide.description")}
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-white border border-gray-200">
                <div className="flex items-start gap-3">
                  <LightbulbIcon className="w-5 h-5 text-warning-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {t("guide.howToTitle")}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {howToBody}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 p-3 rounded-lg bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors group"
                >
                  <ChartIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  <div>
                    <span className="text-sm font-medium text-gray-900">{t("guide.dashboardLink")}</span>
                    <span className="text-xs text-gray-500 block">{t("guide.dashboardText")}</span>
                  </div>
                </Link>
                <Link
                  href="/about"
                  className="flex items-center gap-2 p-3 rounded-lg bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors group"
                >
                  <InfoIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  <div>
                    <span className="text-sm font-medium text-gray-900">{t("guide.aboutLink")}</span>
                    <span className="text-xs text-gray-500 block">{t("guide.aboutText")}</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr] items-start animate-fade-in-up stagger-3">
        {/* Features List */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {t("features.title")}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {t("features.subtitle")}
            </p>
          </div>

          <ul className="space-y-2">
            {t("features.items")
              .split("|")
              .map((text, index) => (
                <li
                  key={text}
                  className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <FeatureIcon index={index} />
                  </div>
                  <span className="text-sm text-gray-700 leading-relaxed pt-1">
                    {text}
                  </span>
                </li>
              ))}
          </ul>
        </section>

        {/* Form Card */}
        <Card padding="none" className="overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                <PencilIcon className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">
                {t("formHeader.title")}
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success-50 text-success-600 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse" />
              {t("formHeader.badge")}
            </span>
          </div>
          <div className="p-6 bg-gray-50/50">
            <SkillForm />
          </div>
        </Card>
      </div>

      {isDemo && (
        <DemoGuideBanner
          step={1}
          title={t("demoGuide.title")}
          description={<>{t("demoGuide.description")}</>}
        />
      )}
    </div>
  );
}

/* ============================================
   Icon Components
   ============================================ */

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );
}

function FeatureIcon({ index }: { index: number }) {
  const icons = [
    // Map
    <svg key="map" className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>,
    // Calendar
    <svg key="cal" className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>,
    // Briefcase
    <svg key="brief" className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>,
    // Microphone
    <svg key="mic" className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>,
    // Document
    <svg key="doc" className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>,
  ];

  return icons[index] || icons[0];
}
