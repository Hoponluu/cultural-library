-- Chạy toàn bộ file này trong Supabase Dashboard → SQL Editor → New query → Run.
-- An toàn để chạy lại nhiều lần (idempotent).

create table if not exists categories (
  id text primary key,
  name text not null
);

create table if not exists books (
  id text primary key,
  title text not null,
  author text not null default '',
  publisher text not null default '',
  thumbnail text not null default '',
  description text not null default '',
  link text not null default '',
  category_ids text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists books_category_ids_idx on books using gin (category_ids);

-- Dùng để xoá 1 category khỏi tất cả sách đang gán nó, gọi atomically qua rpc().
create or replace function remove_category_from_books(cat_id text)
returns void
language sql
as $$
  update books
  set category_ids = array_remove(category_ids, cat_id)
  where category_ids @> array[cat_id];
$$;

-- Bucket lưu ảnh bìa sách, để public để trang public đọc ảnh trực tiếp qua URL.
insert into storage.buckets (id, name, public)
values ('covers', 'covers', true)
on conflict (id) do update set public = excluded.public;

-- Cấu hình chung của trang (hiện chỉ có ảnh header), luôn chỉ có 1 dòng 'default'.
create table if not exists site_settings (
  id text primary key default 'default',
  header_image_url text not null default '',
  updated_at timestamptz not null default now()
);

insert into site_settings (id) values ('default')
on conflict (id) do nothing;

-- Bucket lưu các ảnh dùng chung cho giao diện trang (ảnh header...), tách riêng khỏi ảnh bìa sách.
insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do update set public = excluded.public;

-- Ứng dụng chỉ truy cập Supabase bằng service_role key ở phía server (không dùng ở client),
-- key này bỏ qua Row Level Security nên KHÔNG cần bật RLS/policy cho các bảng trên.
