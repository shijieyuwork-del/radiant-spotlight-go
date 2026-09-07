-- Revoke direct EXECUTE on SECURITY DEFINER functions that should not be callable via the API.
-- Trigger functions and cron/service-only functions never need anon/authenticated EXECUTE.
REVOKE EXECUTE ON FUNCTION public.enqueue_weekly_security_summary() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.run_security_watchdog() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.rate_limit_quote_requests() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM anon, authenticated;
-- has_role stays executable by authenticated: RLS policies call it on behalf of the querying role.