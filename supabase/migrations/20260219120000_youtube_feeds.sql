create table public.youtube_feeds (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  youtube_url text not null,
  thumbnail_url text,
  channel_name text not null,
  visa_id uuid references public.visas(id) on delete set null,
  created_at timestamptz default now() not null
);

alter table public.youtube_feeds enable row level security;

create policy "Admins can manage youtube feeds"
  on public.youtube_feeds
  for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Public can view youtube feeds"
  on public.youtube_feeds
  for select
  using (true);
