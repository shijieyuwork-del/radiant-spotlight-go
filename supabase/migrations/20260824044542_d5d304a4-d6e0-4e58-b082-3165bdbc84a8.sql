CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  action text NOT NULL,
  actor_id uuid,
  actor_email text,
  bucket text,
  target text NOT NULL,
  ip text,
  user_agent text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX audit_logs_created_at_idx ON public.audit_logs (created_at DESC);
CREATE INDEX audit_logs_action_idx ON public.audit_logs (action);

GRANT SELECT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can read audit logs"
ON public.audit_logs FOR SELECT TO authenticated
USING ((auth.jwt() ->> 'email') = 'shijieyuwork@gmail.com');

CREATE OR REPLACE FUNCTION public.read_profile(p_id uuid)
RETURNS SETOF public.profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR (auth.uid() <> p_id AND (auth.jwt() ->> 'email') <> 'shijieyuwork@gmail.com') THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  INSERT INTO public.audit_logs (action, actor_id, actor_email, target)
  VALUES ('profile_read', auth.uid(), auth.jwt() ->> 'email', p_id::text);
  RETURN QUERY SELECT * FROM public.profiles WHERE id = p_id;
END;
$$;

REVOKE ALL ON FUNCTION public.read_profile(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.read_profile(uuid) TO authenticated;