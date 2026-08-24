-- 安全看门狗：每晚自动漂移检查 + 告警 outbox（邮件投递在域名配置完成后激活）
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- 每次扫描的发现明细
create table if not exists public.security_watchdog_findings (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null,
  severity text not null check (severity in ('critical','warning','info')),
  check_key text not null,
  object_name text not null,
  detail text not null,
  created_at timestamptz not null default now()
);
grant select on public.security_watchdog_findings to authenticated;
grant all on public.security_watchdog_findings to service_role;
alter table public.security_watchdog_findings enable row level security;
create policy "Admin can read watchdog findings"
  on public.security_watchdog_findings for select to authenticated
  using ((auth.jwt() ->> 'email') = 'shijieyuwork@gmail.com');

-- 告警 outbox：待投递的邮件告警（nightly=新增告警，weekly=每周摘要）
create table if not exists public.security_alert_outbox (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('nightly','weekly')),
  subject text not null,
  body text not null,
  finding_count int not null default 0,
  status text not null default 'pending' check (status in ('pending','sent','failed')),
  created_at timestamptz not null default now(),
  sent_at timestamptz
);
grant select on public.security_alert_outbox to authenticated;
grant all on public.security_alert_outbox to service_role;
alter table public.security_alert_outbox enable row level security;
create policy "Admin can read alert outbox"
  on public.security_alert_outbox for select to authenticated
  using ((auth.jwt() ->> 'email') = 'shijieyuwork@gmail.com');

-- 漂移检查：与已确认的安全基线对比，发现新增风险
create or replace function public.run_security_watchdog()
returns uuid
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_run uuid := gen_random_uuid();
  v_new int := 0;
begin
  -- 1. public 表未启用 RLS（critical）
  insert into public.security_watchdog_findings (run_id, severity, check_key, object_name, detail)
  select v_run, 'critical', 'table_without_rls', c.relname,
         'public.' || c.relname || ' has row level security disabled'
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity;

  -- 2. 启用 RLS 但没有任何策略（warning：等于全锁，可能是漏配）
  insert into public.security_watchdog_findings (run_id, severity, check_key, object_name, detail)
  select v_run, 'warning', 'table_without_policies', c.relname,
         'public.' || c.relname || ' has RLS enabled but no policies'
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind = 'r' and c.relrowsecurity
    and not exists (select 1 from pg_policies p where p.schemaname = 'public' and p.tablename = c.relname);

  -- 3. 公开存储桶（critical：本项目基线为全部私有）
  insert into public.security_watchdog_findings (run_id, severity, check_key, object_name, detail)
  select v_run, 'critical', 'public_bucket', b.name,
         'storage bucket ' || b.name || ' is public (baseline: all private)'
  from storage.buckets b where b.public;

  -- 4. 对 anon 完全放开的策略（warning）
  insert into public.security_watchdog_findings (run_id, severity, check_key, object_name, detail)
  select v_run, 'warning', 'anon_true_policy', p.tablename || '.' || p.policyname,
         'policy ' || p.policyname || ' on public.' || p.tablename || ' grants anon access with qual=true'
  from pg_policies p
  where p.schemaname = 'public' and 'anon' = any(p.roles) and p.qual = 'true';

  -- 与上一次运行对比，只对“新增”的 critical/warning 生成告警
  select count(*) into v_new
  from public.security_watchdog_findings f
  where f.run_id = v_run and f.severity in ('critical','warning')
    and not exists (
      select 1 from public.security_watchdog_findings prev
      where prev.run_id <> v_run and prev.check_key = f.check_key and prev.object_name = f.object_name
    );

  if v_new > 0 then
    insert into public.security_alert_outbox (kind, subject, body, finding_count)
    select 'nightly',
           '[Security] ' || v_new || ' new finding(s) from nightly scan',
           string_agg(format('[%s] %s — %s', f.severity, f.object_name, f.detail), E'\n'),
           v_new
    from public.security_watchdog_findings f
    where f.run_id = v_run and f.severity in ('critical','warning')
      and not exists (
        select 1 from public.security_watchdog_findings prev
        where prev.run_id <> v_run and prev.check_key = f.check_key and prev.object_name = f.object_name
      );
  end if;

  return v_run;
end;
$$;

-- 每周摘要
create or replace function public.enqueue_weekly_security_summary()
returns void
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_total int; v_crit int; v_warn int; v_runs int;
begin
  select count(distinct run_id), count(*),
         count(*) filter (where severity = 'critical'),
         count(*) filter (where severity = 'warning')
  into v_runs, v_total, v_crit, v_warn
  from public.security_watchdog_findings
  where created_at >= now() - interval '7 days';

  insert into public.security_alert_outbox (kind, subject, body, finding_count)
  values ('weekly',
          '[Security] Weekly summary: ' || v_crit || ' critical / ' || v_warn || ' warning',
          'Scans run: ' || v_runs || E'\nTotal findings: ' || v_total ||
          E'\nCritical: ' || v_crit || E'\nWarning: ' || v_warn,
          v_total);
end;
$$;

-- 计划任务：每晚 02:00 UTC 扫描，每周一 03:00 UTC 摘要
do $$ begin perform cron.unschedule('security-watchdog-nightly'); exception when others then null; end $$;
do $$ begin perform cron.unschedule('security-watchdog-weekly'); exception when others then null; end $$;
select cron.schedule('security-watchdog-nightly', '0 2 * * *', $$select public.run_security_watchdog();$$);
select cron.schedule('security-watchdog-weekly', '0 3 * * 1', $$select public.enqueue_weekly_security_summary();$$);