import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import "./globals.css";
import { AuthButton } from "@/components/AuthButton";
import { PwaRegister } from "@/components/PwaRegister";
import { ToastProvider } from "@/components/ui/toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppLogo } from "@/components/AppLogo";
import { NavLinks } from "@/components/NavLinks";
import Script from "next/script";
import { getLocale } from "next-intl/server";

// LanguageSwitcher は usePathname を使うため、SSR を無効にして動的インポート
const LanguageSwitcher = dynamic(
  () => import("@/src/components/LanguageSwitcher").then((mod) => mod.LanguageSwitcher),
  { ssr: false, loading: () => <div className="w-12 h-9" /> }
);

// メタデータ（OGP対応）
export const metadata: Metadata = {
  title: {
    default: "AI Skill Map Generator - 職務経歴から転職準備を60秒で完成",
    template: "%s | AI Skill Map Generator"
  },
  description:
    "職務経歴を入力するだけで、スキルマップ・学習ロードマップ・求人マッチング・面接練習を60秒で一括生成。AI × キャリア診断で、転職準備をもっと楽しく、もっと確実に。",
  keywords: [
    "スキルマップ",
    "転職",
    "キャリア診断",
    "AI",
    "職務経歴",
    "学習ロードマップ",
    "求人マッチング",
    "面接練習",
    "エンジニア転職",
    "キャリアプラン",
    "転職準備",
    "スキル分析"
  ],
  authors: [{ name: "Nobuaki Hashimoto" }],
  creator: "Nobuaki Hashimoto",
  publisher: "AI Skill Map Generator",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://ai-skill-map-generator.vercel.app",
    siteName: "AI Skill Map Generator",
    title: "AI Skill Map Generator - 職務経歴から転職準備を60秒で完成",
    description:
      "職務経歴を入力するだけで、スキルマップ・学習ロードマップ・求人マッチング・面接練習を60秒で一括生成。AI × キャリア診断で、転職準備をもっと楽しく。",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Skill Map Generator - 職務経歴から転職準備を60秒で完成",
    description: "職務経歴を入力するだけで、スキルマップ・学習ロードマップ・求人マッチング・面接練習を60秒で一括生成。",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }]
  },
  manifest: "/manifest.json"
};

// Viewport設定
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" }
  ]
};
 
export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const isEn = locale === "en";

  // ロケールに応じたラベル
  const skipLabel = isEn ? "Skip to main content" : "メインコンテンツへスキップ";
  const githubAriaLabel = isEn ? "Open GitHub repository (new tab)" : "GitHub リポジトリを開く（新しいタブ）";

  return (
    <html lang={locale} className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* iOS / PWA 設定 */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Skill Map" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30 text-foreground antialiased">
        {/* 軽量なアクセス解析（Plausible など）を想定したスクリプト挿入ポイント */}
        <Script
          src="https://plausible.io/js/script.js"
          data-domain="ai-skill-map-generator.vercel.app"
          defer
        />
        <PwaRegister />
        <ToastProvider>
          <ErrorBoundary>
            {/* Decorative background elements */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-200/30 rounded-full blur-3xl animate-float" />
              <div className="absolute top-1/3 -left-20 w-60 h-60 bg-indigo-200/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl" />
            </div>

            <div className="min-h-screen flex flex-col">
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-sky-600 focus:text-white focus:rounded-lg"
              >
                {skipLabel}
              </a>

              <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-lg">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
                  {/* ロゴ（SM アイコン + テキスト） */}
                  <AppLogo size="sm" />

                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* デスクトップナビゲーション */}
                    <nav className="hidden md:flex gap-1 text-sm" aria-label="Main navigation">
                      <NavLinks variant="desktop" />
                    </nav>

                    {/* 言語切り替えボタン（DocuFlow 風のコンパクト表示） */}
                    <LanguageSwitcher compact />

                    <AuthButton />
                  </div>
                </div>

                {/* モバイルナビゲーション */}
                <nav
                  className="md:hidden border-t border-slate-100 bg-white/90"
                  aria-label="Mobile navigation"
                >
                  <div className="max-w-5xl mx-auto px-3 py-2 flex gap-1.5 overflow-x-auto">
                    <NavLinks variant="mobile" />
                  </div>
                </nav>
              </header>

              <main id="main-content" className="flex-1" tabIndex={-1}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10">
                  <div className="relative rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur shadow-xl shadow-slate-200/50 overflow-hidden">
                    {/* Card header decoration */}
                    <div
                      className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent"
                      aria-hidden="true"
                    />
                    <div
                      className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-sky-50/50 to-transparent"
                      aria-hidden="true"
                    />

                    <div className="relative p-5 sm:p-6 md:p-8">{children}</div>
                  </div>
                </div>
              </main>

              <footer className="border-t border-slate-200/80 bg-white/50 backdrop-blur-sm">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* フッターロゴ（小さめ） */}
                      <div className="flex items-center gap-2">
                        <div
                          className="h-6 w-6 rounded-lg bg-gradient-to-br from-sky-400 via-indigo-500 to-emerald-400 flex items-center justify-center text-[8px] font-black text-white shadow-sm"
                          aria-hidden="true"
                        >
                          SM
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                          AI Skill Map Generator
                        </span>
                      </div>
                      <a
                        href="https://github.com/AyumuKobayashiproducts/ai-skill-map-generator"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 rounded"
                        aria-label={githubAriaLabel}
                      >
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        GitHub
                      </a>
                    </div>
                    <p className="text-xs text-slate-500">
                      © {new Date().getFullYear()} All rights reserved.
                    </p>
                  </div>
                </div>
              </footer>
            </div>
          </ErrorBoundary>
        </ToastProvider>
      </body>
    </html>
  );
}
