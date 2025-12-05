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

-- Row Level Security（RLS）の有効化とポリシー例
-- 本番運用する場合は Supabase コンソールから有効化することを推奨
-- 以下を Supabase SQL Editor などで実行してください。
--
-- alter table public.skill_maps enable row level security;
-- alter table public.usage_logs enable row level security;
--
-- -- skill_maps: 自分のレコードのみ参照・更新できる
-- create policy "skill_maps_select_own"
--   on public.skill_maps
--   for select
--   using (auth.uid() is not null and user_id = auth.uid());
--
-- create policy "skill_maps_insert_own"
--   on public.skill_maps
--   for insert
--   with check (auth.uid() is not null and user_id = auth.uid());
--
-- -- usage_logs: 自分のログのみ参照可能（挿入は全ユーザー許可）
-- create policy "usage_logs_select_own"
--   on public.usage_logs
--   for select
--   using (auth.uid() is not null and user_id = auth.uid());
--
-- create policy "usage_logs_insert_any"
--   on public.usage_logs
--   for insert
--   with check (true);

-- usage_logs テーブル（どの機能がどれだけ使われたかの簡易ログ）
create table if not exists public.usage_logs (
  id uuid primary key default gen_random_uuid(),
  event text not null,
  user_id uuid,
  meta jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- interview_sessions テーブル（面接練習セッションの履歴）
create table if not exists public.interview_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  skill_map_id uuid references public.skill_maps(id) on delete set null,
  interview_type text not null, -- 'general' | 'technical' | 'behavioral'
  question_count integer not null,
  overall_score integer, -- 1-5
  strong_points jsonb, -- string[]
  improvement_points jsonb, -- string[]
  next_steps jsonb, -- string[]
  summary text,
  exchanges jsonb, -- { question, answer, feedback }[]
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);



