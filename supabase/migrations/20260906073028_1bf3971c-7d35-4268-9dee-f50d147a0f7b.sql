alter table public.doctors add column if not exists i18n jsonb not null default '{}'::jsonb;
alter table public.videos add column if not exists i18n jsonb not null default '{}'::jsonb;