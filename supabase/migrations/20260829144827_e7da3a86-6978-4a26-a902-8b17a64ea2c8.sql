create table public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text,
  phone_prefix text,
  phone text not null,
  country text not null,
  procedure text not null,
  notes text,
  contact_method text not null check (contact_method in ('email','whatsapp')),
  expert_name text,
  city text,
  preferred_slot text,
  source text
);

grant insert on public.quote_requests to anon, authenticated;
grant select on public.quote_requests to authenticated;
grant all on public.quote_requests to service_role;

alter table public.quote_requests enable row level security;

create policy "Anyone can submit a quote request"
on public.quote_requests for insert to anon, authenticated
with check (true);

create policy "Only admin can read quote requests"
on public.quote_requests for select to authenticated
using ((auth.jwt() ->> 'email') = 'shijieyuwork@gmail.com');