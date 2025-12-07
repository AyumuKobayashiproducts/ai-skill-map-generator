import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const featureKeys = ["inventory", "roadmap", "jobMatch"] as const;

const roleKeys = ["planning", "frontend", "backend", "testing", "design"] as const;

const techStack = [
  {
    key: "frontend" as const,
    items: ["Next.js 15 (App Router)", "TypeScript", "Tailwind CSS"],
    emoji: "🎨"
  },
  {
    key: "backend" as const,
    items: ["Next.js Route Handlers", "Edge Functions"],
    emoji: "⚙️"
  },
  {
    key: "dataAuth" as const,
    items: ["Supabase (Postgres)", "Supabase Auth"],
    emoji: "🗄️"
  },
  {
    key: "ai" as const,
    items: ["OpenAI API", "GPT-4o"],
    emoji: "🤖"
  },
  {
    key: "quality" as const,
    items: ["Zod", "Vitest", "Playwright"],
    emoji: "✅"
  },
  {
    key: "ops" as const,
    items: ["Row Level Security", "Usage Logs"],
    emoji: "📊"
  }
] as const;

const planKeys = ["free", "pro"] as const;

const futureIcons = ["🎯", "📈", "👥"] as const;

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <div className="space-y-8">
      {/* Hero section */}
      <header className="space-y-4 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 via-indigo-500 to-emerald-400 flex items-center justify-center text-white text-2xl shadow-lg shadow-sky-500/25">
            ℹ️
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {t("hero.title")}
            </h1>
            <p className="text-sm text-slate-500">
              {t("hero.subtitle")}
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed max-w-2xl">
          {t("hero.intro")}
        </p>
      </header>

      {/* Features */}
      <section className="animate-fade-in-up stagger-1">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>✨</span>
          {t("sections.goalTitle")}
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {featureKeys.map((key, idx) => {
            const icons = ["🗺️", "📅", "💼"] as const;
            const icon = icons[idx] ?? "✨";
            return (
              <Card
                key={key}
                className="card-hover animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <CardContent className="pt-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-100 to-indigo-100 flex items-center justify-center text-xl mb-3">
                    {icon}
                  </div>
                  <h3 className="font-semibold text-slate-900">
                    {t(`features.${key}.title`)}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    {t(`features.${key}.desc`)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* My role */}
      <section className="animate-fade-in-up stagger-2">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>👤</span>
          {t("sections.roleTitle")}
        </h2>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-slate-700 mb-4">
              {t("sections.roleBody")}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {roleKeys.map((key) => {
                const emojiMap: Record<(typeof roleKeys)[number], string> = {
                  planning: "📋",
                  frontend: "🖥️",
                  backend: "🔧",
                  testing: "🧪",
                  design: "🎨"
                };
                return (
                  <div
                    key={key}
                    className="text-center p-3 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <span className="text-2xl">
                      {emojiMap[key] ?? "✨"}
                    </span>
                    <p className="text-xs font-semibold text-slate-900 mt-2">
                      {t(`roles.${key}.title`)}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {t(`roles.${key}.desc`)}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Tech stack */}
      <section className="animate-fade-in-up stagger-3">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>🛠️</span>
          {t("sections.techStackTitle")}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {techStack.map((tech) => (
            <Card key={tech.key} className="card-hover">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{tech.emoji}</span>
                  <h3 className="font-semibold text-slate-900 text-sm">
                    {t(`techStack.${tech.key}.category`)}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tech.items.map((item) => (
                    <span
                      key={item}
                      className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing（料金イメージ） */}
      <section className="animate-fade-in-up stagger-3">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>💰</span>
          {t("sections.pricingTitle")}
        </h2>
        <p className="text-xs text-slate-600 mb-3 leading-relaxed">
          {t("sections.pricingBody")}
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {planKeys.map((key) => {
            const features = t(`pricing.${key}.features`).split("|");
            return (
              <Card key={key} className="card-hover border-slate-200">
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">
                        {t(`pricing.${key}.name`)}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {t(`pricing.${key}.description`)}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                      {t(`pricing.${key}.badge`)}
                    </span>
                  </div>
                  <p className="text-base font-bold text-slate-900">
                    {t(`pricing.${key}.price`)}
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-1.5">
                        <span className="mt-0.5 text-emerald-500">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Future improvements */}
      <section className="animate-fade-in-up stagger-4">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>🚀</span>
          {t("sections.futureTitle")}
        </h2>
        <Card className="bg-gradient-to-br from-sky-50/50 to-indigo-50/50">
          <CardContent className="pt-4">
            <ul className="space-y-3">
              {t("future.items")
                .split("|")
                .map((text, idx) => (
                  <li key={text} className="flex items-start gap-3">
                    <span className="text-lg flex-shrink-0">
                      {futureIcons[idx] ?? "✨"}
                    </span>
                    <span className="text-sm text-slate-700">{text}</span>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Interview scene */}
      <section className="animate-fade-in-up stagger-5">
        <Card className="border-2 border-sky-200/50 bg-gradient-to-r from-sky-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>💬</span>
              {t("sections.sceneTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-700 leading-relaxed">
              {t("sections.sceneBody")}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Feedback */}
      <section className="animate-fade-in-up stagger-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm md:text-base">
              <span>🗣️</span>
              {t("sections.feedbackTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs md:text-sm text-slate-700">
            <p>
              {t("sections.feedbackBody")}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="https://github.com/AyumuKobayashiproducts/ai-skill-map-generator/discussions"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 text-white text-xs md:text-sm font-medium shadow-sm hover:bg-sky-700 transition-colors"
              >
                {t("feedback.buttons.discussions")}
              </Link>
              <Link
                href="https://github.com/AyumuKobayashiproducts/ai-skill-map-generator/issues/new/choose"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs md:text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {t("feedback.buttons.issues")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
