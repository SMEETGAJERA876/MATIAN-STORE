-- Run this once in your Supabase project's SQL editor (Database > SQL Editor).
-- Creates the table that stores Contact Us messages / support tickets so they
-- persist on Vercel and show up in the admin Notifications Center.

create table if not exists public.support_tickets (
  id text primary key,
  ticket_number text not null,
  subject text not null default 'General Inquiry',
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  message text not null,
  priority text not null default 'Medium' check (priority in ('Urgent', 'High', 'Medium', 'Low')),
  status text not null default 'Open' check (status in ('Open', 'In Progress', 'Resolved', 'Closed')),
  category text not null default 'General' check (category in ('Billing', 'Shipping', 'Product Issue', 'General')),
  created_at timestamptz not null default now()
);

create index if not exists support_tickets_created_at_idx on public.support_tickets (created_at desc);

-- Messages contain customer PII. With RLS on and no policies, only the
-- server (using SUPABASE_SECRET_KEY) can read or write this table.
alter table public.support_tickets enable row level security;
