# ==========================================
# AI Skill Map Generator - Dockerfile
# ==========================================

# ベースイメージ
FROM node:20-alpine AS base

# 依存関係のインストール
FROM base AS deps
WORKDIR /app

# package.json と package-lock.json をコピー
COPY package.json package-lock.json* ./

# 依存関係をインストール
RUN npm ci

# ビルドステージ
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 環境変数（ビルド時に必要なもの）
ENV NEXT_TELEMETRY_DISABLED 1

# ビルド
RUN npm run build

# 本番ステージ
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# セキュリティ: 非rootユーザーで実行
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 必要なファイルをコピー
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]

