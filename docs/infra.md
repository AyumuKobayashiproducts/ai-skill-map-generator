# インフラ・運用ドキュメント

このドキュメントでは、AI Skill Map Generator のインフラ構成、セットアップ手順、運用に関する情報をまとめています。

---

## 技術スタック

| レイヤー | 技術 | 用途 |
|---------|------|------|
| ホスティング | Vercel | Next.js アプリのホスティング |
| データベース | Supabase (PostgreSQL) | ユーザーデータ・スキルマップの保存 |
| 認証 | Supabase Auth | ログイン・セッション管理 |
| AI | OpenAI API (GPT-4.1-mini) | スキル分析・フィードバック生成 |
| CDN | Vercel Edge Network | 静的アセットの配信 |

---

## 環境変数

### 必須の環境変数

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...  # サーバーサイドのみ

# OpenAI
OPENAI_API_KEY=sk-xxx...
```

### .env.example

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# OpenAI
OPENAI_API_KEY=
```

---

## Supabase セットアップ

### 1. プロジェクト作成

1. [Supabase](https://supabase.com/) にログイン
2. 新規プロジェクトを作成
3. プロジェクト設定から API URL と anon key を取得

### 2. データベーススキーマ

SQL Editor で以下を実行:

```sql
-- supabase/schema.sql の内容を実行

-- profiles テーブル
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- skill_maps テーブル
create table if not exists public.skill_maps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  raw_input text,
  categories jsonb,
  strengths text,
  weaknesses text,
  roadmap_30 text,
  roadmap_90 text,
  chart_data jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- interview_sessions テーブル
create table if not exists public.interview_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  skill_map_id uuid references public.skill_maps(id) on delete set null,
  interview_type text not null,
  question_count integer not null,
  overall_score integer,
  strong_points jsonb,
  improvement_points jsonb,
  next_steps jsonb,
  summary text,
  exchanges jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- usage_logs テーブル
create table if not exists public.usage_logs (
  id uuid primary key default gen_random_uuid(),
  event text not null,
  user_id uuid,
  meta jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### 3. Row Level Security (RLS)

本番環境では RLS を有効にすることを推奨:

```sql
-- RLS を有効化
alter table public.skill_maps enable row level security;
alter table public.interview_sessions enable row level security;
alter table public.usage_logs enable row level security;

-- skill_maps: 自分のレコードのみ参照・更新
create policy "skill_maps_select_own"
  on public.skill_maps
  for select
  using (auth.uid() is not null and user_id = auth.uid());

create policy "skill_maps_insert_own"
  on public.skill_maps
  for insert
  with check (auth.uid() is not null and user_id = auth.uid());

-- interview_sessions: 自分のセッションのみ
create policy "interview_sessions_select_own"
  on public.interview_sessions
  for select
  using (auth.uid() is not null and user_id = auth.uid());

create policy "interview_sessions_insert_own"
  on public.interview_sessions
  for insert
  with check (auth.uid() is not null and user_id = auth.uid());
```

---

## ローカル開発

### Docker を使う場合

```bash
# Docker Compose で起動
docker-compose up -d

# ログを確認
docker-compose logs -f app

# 停止
docker-compose down
```

### Docker を使わない場合

```bash
# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev

# http://localhost:3000 でアクセス
```

---

## デプロイ

### Vercel へのデプロイ

1. [Vercel](https://vercel.com/) にリポジトリを接続
2. 環境変数を設定:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
3. デプロイを実行

### 自動デプロイ

- `main` ブランチへのプッシュで自動デプロイ
- PR ごとにプレビューデプロイが作成される

---

## コスト見積もり

### 無料枠での運用（個人開発・ポートフォリオ用）

| サービス | 無料枠 | 想定使用量 |
|---------|--------|-----------|
| Vercel | 100GB/月 帯域, 100時間/月 ビルド | 十分 |
| Supabase | 500MB DB, 1GB ストレージ | 十分 |
| OpenAI | - | 月 $5〜20 程度 |

### スケール時の概算（月間 1,000 ユーザー想定）

| サービス | 月額 |
|---------|------|
| Vercel Pro | $20 |
| Supabase Pro | $25 |
| OpenAI API | $50〜100 |
| **合計** | **$95〜145** |

---

## 監視・ログ

### 現状

- `usage_logs` テーブルで機能ごとの利用ログを記録
- `/admin/usage` で簡易的な利用統計を表示

### 将来の拡張案

- **エラー監視**: Sentry の導入
- **パフォーマンス監視**: Vercel Analytics / Web Vitals
- **ログ集約**: LogDNA / Papertrail
- **アラート**: Slack 通知

---

## セキュリティ

### 現状の対策

- [x] API 入力を Zod でバリデーション
- [x] Supabase RLS によるデータアクセス制御（オプション）
- [x] 環境変数によるシークレット管理
- [x] TypeScript による型安全性

### 追加検討事項

- [ ] Rate Limiting の実装
- [ ] CSP ヘッダーの設定
- [ ] 依存関係の脆弱性スキャン (dependabot)

---

## バックアップ

### Supabase

- Point-in-time Recovery (Pro プラン)
- 日次のスナップショット

### 手動バックアップ

```bash
# pg_dump でエクスポート
pg_dump -h db.xxx.supabase.co -U postgres -d postgres > backup.sql
```

---

## トラブルシューティング

### よくある問題

**Q: OpenAI API のレート制限に引っかかる**

A: リクエストの間隔を空けるか、OpenAI のプランをアップグレードする

**Q: Supabase の接続がタイムアウトする**

A: Supabase ダッシュボードでプロジェクトがアクティブか確認。無料枠は一定期間アクセスがないと停止する

**Q: ビルドが失敗する**

A: `npm run build` をローカルで実行してエラーを確認

---

## 関連ドキュメント

- [アーキテクチャ概要](./architecture.md)
- [設計メモ](./design-notes.md)
- [CONTRIBUTING.md](../CONTRIBUTING.md)



