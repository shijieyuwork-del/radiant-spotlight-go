-- 收紧看门狗函数的执行权限：仅 service_role / postgres（pg_cron）可调用
revoke execute on function public.run_security_watchdog() from anon, authenticated;
revoke execute on function public.enqueue_weekly_security_summary() from anon, authenticated;
grant execute on function public.run_security_watchdog() to service_role;
grant execute on function public.enqueue_weekly_security_summary() to service_role;

-- 扩展移出 public schema
create schema if not exists extensions;
do $$
begin
  alter extension pg_net set schema extensions;
exception when others then null;
end $$;
do $$
begin
  alter extension pg_cron set schema extensions;
exception when others then null;
end $$;