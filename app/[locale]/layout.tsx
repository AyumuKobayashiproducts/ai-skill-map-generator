import { Metadata } from "next";
import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/src/i18n/config";

interface LocaleLayoutProps {
  children: ReactNode;
  params: { locale: string };
}

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = params.locale as Locale;

  const isEnglish = locale === "en";

  const title = isEnglish
    ? "AI Skill Map Generator – Career diagnosis for web engineers"
    : "AI Skill Map Generator – Webエンジニア向けキャリア診断";

  const description = isEnglish
    ? "Generate a personalized skill map, learning roadmap and interview practice flow in about 60 seconds. Designed for web engineers preparing for their next move."
    : "約60秒でスキルマップ・学習ロードマップ・面接練習の流れを自動生成。次の転職を考えているWebエンジニア向けのキャリア診断ツールです。";

  const urlBase = "https://ai-skill-map-generator.example.com";
  const localePath = locale === "ja" ? "/ja" : "/en";
  const url = `${urlBase}${localePath}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        "ja-JP": `${urlBase}/ja`,
        "en-US": `${urlBase}/en`
      }
    },
    openGraph: {
      title,
      description,
      url,
      locale: isEnglish ? "en_US" : "ja_JP",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const locale = params.locale as Locale;

  if (!locales.includes(locale)) {
    notFound();
  }

  // 将来的にセクションごとの辞書に分割する前提で、まずはルートの messages を読み込む
  const messages = (await import(`@/src/messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}


