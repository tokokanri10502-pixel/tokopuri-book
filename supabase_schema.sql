-- =============================================
-- BOOK MEMORIES - Supabase テーブル定義
-- Supabase ダッシュボード > SQL Editor で実行してください
-- =============================================

create table if not exists public.books (
  id          uuid default gen_random_uuid() primary key,
  title       text not null,
  author      text not null,
  publisher   text,
  genre       text,
  isbn        text,
  description text,
  cover_url   text not null default '',
  status      text not null default 'plan' check (status in ('reading', 'done', 'plan')),
  review      text,
  rating      integer check (rating >= 1 and rating <= 5),
  user_id     text not null default 'om-user-001',
  created_at  timestamp with time zone default now(),
  updated_at  timestamp with time zone default now()
);

-- インデックス
create index if not exists books_user_id_idx on public.books (user_id);
create index if not exists books_created_at_idx on public.books (created_at desc);

-- Row Level Security（必要に応じて有効化）
-- alter table public.books enable row level security;

-- RLS ポリシー例（認証なしの場合はコメントアウトのまま）
-- create policy "Allow all for demo user" on public.books
--   for all using (user_id = 'om-user-001');
