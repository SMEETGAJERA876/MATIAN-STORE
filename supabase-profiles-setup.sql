-- Run this once in your Supabase project's SQL editor (Database > SQL Editor).
-- Creates the profiles table that stores app-level user data (name, role,
-- status, order stats) keyed to Supabase Auth's built-in auth.users table.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  email text not null,
  role text not null default 'CUSTOMER' check (role in ('ADMIN', 'CUSTOMER')),
  status text not null default 'Active' check (status in ('Active', 'Blocked')),
  total_orders integer not null default 0,
  total_spent numeric not null default 0,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profiles row (always role = CUSTOMER) whenever someone signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- After you sign up your own account through the website's /login page once,
-- run this to make that account an admin (replace the email):
-- update public.profiles set role = 'ADMIN' where email = 'you@example.com';
