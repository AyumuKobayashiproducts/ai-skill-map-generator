import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import "./globals.css";
import { AuthButton } from "@/components/AuthButton";
import { PwaRegister } from "@/components/PwaRegister";
import { ToastProvider } from "@/components/ui/toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
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
    default: "AI Skill Map Generator",
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
    title: "AI Skill Map Generator",
    description:
      "職務経歴を入力するだけで、スキルマップ・学習ロードマップ・求人マッチング・面接練習を60秒で一括生成。",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Skill Map Generator",
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
    { media: "(prefers-color-scheme: dark)", color: "#18181b" }
  ]
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const isEn = locale === "en";

  const skipLabel = isEn ? "Skip to main content" : "メインコンテンツへスキップ";
  const githubAriaLabel = isEn ? "Open GitHub repository" : "GitHub リポジトリを開く";

  return (
    <html lang={locale} className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Skill Map" />
      </head>
      <body className="min-h-screen bg-white antialiased">
        <Script
          src="https://plausible.io/js/script.js"
          data-domain="ai-skill-map-generator.vercel.app"
          defer
        />
        <PwaRegister />
        <ToastProvider>
          <ErrorBoundary>
            <div className="min-h-screen flex flex-col">
              {/* Skip link */}
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-gray-900 focus:text-white focus:rounded-lg focus:text-sm"
              >
                {skipLabel}
              </a>

              {/* Header - Vercel style */}
              <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                  <div className="h-16 flex items-center justify-between gap-4">
                    {/* Logo */}
                    <Link
                      href="/"
                      className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      </div>
                      <span className="font-semibold text-gray-900 hidden sm:block">
                        AI Skill Map
                      </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
                      <NavLinks variant="desktop" />
                    </nav>

                    {/* Right side actions */}
                    <div className="flex items-center gap-2">
                      <LanguageSwitcher compact />
                      <AuthButton />
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <nav
                    className="md:hidden border-t border-gray-100 py-2 -mx-4 px-4 overflow-x-auto no-scrollbar"
                    aria-label="Mobile navigation"
                  >
                    <div className="flex gap-1">
                      <NavLinks variant="mobile" />
                    </div>
                  </nav>
                </div>
              </header>

              {/* Main Content */}
              <main id="main-content" className="flex-1" tabIndex={-1}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
                  {children}
                </div>
              </main>

              {/* Footer - Minimal style */}
              <footer className="border-t border-gray-200 bg-gray-50/50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-6">
                      <span className="font-medium text-gray-700">
                        AI Skill Map Generator
                      </span>
                      <a
                        href="https://github.com/AyumuKobayashiproducts/ai-skill-map-generator"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"
                        aria-label={githubAriaLabel}
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        GitHub
                      </a>
                    </div>
                    <p>© {new Date().getFullYear()} All rights reserved.</p>
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
