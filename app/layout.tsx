import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";

// Metadata
export const metadata: Metadata = {
  title: "AI Skill Generator",
  description:
    "Understand your skills and get actionable AI-powered insights. Transform your career with data-driven recommendations.",
  keywords: [
    "skill analysis",
    "career development",
    "AI",
    "skill map",
    "professional growth",
    "radar chart",
  ],
  authors: [{ name: "Developer" }],
  creator: "AI Skill Generator",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ai-skill-map-generator.vercel.app",
    siteName: "AI Skill Generator",
    title: "AI Skill Generator",
    description:
      "Understand your skills and get actionable AI-powered insights.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Skill Generator",
    description:
      "Understand your skills and get actionable AI-powered insights.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
  manifest: "/manifest.json",
};

// Viewport
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0b",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
