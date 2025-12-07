import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // セキュリティヘッダー
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on"
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload"
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "X-Frame-Options",
            value: "DENY"
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block"
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin"
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()"
          }
        ]
      }
    ];
  },

  // パフォーマンス最適化
  reactStrictMode: true,
  poweredByHeader: false,

  // 画像最適化
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      }
    ]
  },

  // TypeScript の型チェック強化（ビルド時）
  typescript: {
    // 本番ビルド時に型エラーがあればビルドを失敗させる
    ignoreBuildErrors: false
  },

  // ESLint
  eslint: {
    // 本番ビルド時にlintエラーがあればビルドを失敗させる
    ignoreDuringBuilds: false
  },

  // 実験的機能
  experimental: {
    // Server Actionsの型安全性向上
    typedRoutes: true
  }
};

export default withNextIntl(nextConfig);

