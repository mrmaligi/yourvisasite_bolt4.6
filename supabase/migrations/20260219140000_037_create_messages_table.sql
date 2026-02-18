-- Create messages table
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  sender_id uuid not null references auth.users(id),
  sender_role text not null check (sender_role in ('user', 'lawyer')),
  message_text text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.messages enable row level security;

-- Create policies

-- Select: Participants can view messages
create policy "Participants can view messages"
  on public.messages for select
  using (
    auth.uid() = sender_id
    or
    exists (
      select 1 from public.bookings b
      where b.id = messages.booking_id
      and b.user_id = auth.uid()
    )
    or
    exists (
      select 1 from public.bookings b
      join lawyer.profiles lp on b.lawyer_id = lp.id
      where b.id = messages.booking_id
      and lp.profile_id = auth.uid()
    )
  );

-- Insert: Participants can send messages
create policy "Participants can send messages"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and (
      exists (
        select 1 from public.bookings b
        where b.id = messages.booking_id
        and b.user_id = auth.uid()
      )
      or
      exists (
        select 1 from public.bookings b
        join lawyer.profiles lp on b.lawyer_id = lp.id
        where b.id = messages.booking_id
        and lp.profile_id = auth.uid()
      )
    )
  );

-- Update: Recipients can mark as read
create policy "Recipients can mark as read"
  on public.messages for update
  using (
    auth.uid() != sender_id
    and (
      exists (
        select 1 from public.bookings b
        where b.id = messages.booking_id
        and b.user_id = auth.uid()
      )
      or
      exists (
        select 1 from public.bookings b
        join lawyer.profiles lp on b.lawyer_id = lp.id
        where b.id = messages.booking_id
        and lp.profile_id = auth.uid()
      )
    )
  )
  with check (
    is_read = true -- Only allow updating is_read to true
  );

-- Enable Realtime
alter publication supabase_realtime add table public.messages;
