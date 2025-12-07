import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

const sectionKeys = ["provision", "data", "disclaimer", "contact"] as const;

const icons: Record<(typeof sectionKeys)[number], string> = {
  provision: "📱",
  data: "🗄️",
  disclaimer: "⚠️",
  contact: "💬"
};

export default async function LegalPage() {
  const t = await getTranslations("legal");

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 flex items-center justify-center text-white text-2xl shadow-lg">
            📜
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {t("hero.title")}
            </h2>
            <p className="text-sm text-slate-500">
              {t("hero.subtitle")}
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-700 leading-relaxed max-w-2xl">
          {t("hero.intro")}
        </p>
      </header>

      {/* Sections */}
      <div className="grid gap-4 md:grid-cols-2">
        {sectionKeys.map((key, idx) => {
          const hasItems = key === "data" || key === "disclaimer";
          const items = hasItems ? t(`sections.${key}.items`) : null;
          const itemList =
            items && Array.isArray(items)
              ? (items as string[])
              : items
              ? String(items).split("|")
              : [];

          return (
            <Card
              key={key}
              className="card-hover animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    {icons[key]}
                  </span>
                  {t(`sections.${key}.title`)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!hasItems && (
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {t(`sections.${key}.content`)}
                  </p>
                )}
                {hasItems && itemList.length > 0 && (
                  <ul className="space-y-2">
                    {itemList.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-slate-600"
                      >
                        <span className="text-slate-400 mt-1">•</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick actions */}
      <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200 animate-fade-in-up stagger-4">
        <CardContent className="pt-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔗</span>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {t("quickLinks.title")}
                </p>
                <p className="text-xs text-slate-500">
                  {t("quickLinks.subtitle")}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/auth/delete"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span>🗑️</span>
                {t("quickLinks.deleteAccount")}
              </Link>
              <a
                href="https://github.com/AyumuKobayashiproducts/ai-skill-map-generator/issues"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 text-sm text-white hover:bg-slate-800 transition-colors"
              >
                <span>🐙</span>
                {t("quickLinks.githubIssues")}
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
