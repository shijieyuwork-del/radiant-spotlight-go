revoke all on function public.run_security_watchdog() from public, anon, authenticated;
revoke all on function public.enqueue_weekly_security_summary() from public, anon, authenticated;
grant execute on function public.run_security_watchdog() to service_role;
grant execute on function public.enqueue_weekly_security_summary() to service_role;

-- pg_net 不支持 SET SCHEMA，改为在 extensions schema 重建
drop extension if exists pg_net;
create extension if not exists pg_net with schema extensions;