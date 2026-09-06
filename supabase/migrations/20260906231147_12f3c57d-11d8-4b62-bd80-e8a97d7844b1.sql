CREATE TABLE public.before_after_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  doctor_id uuid REFERENCES public.doctors(id) ON DELETE SET NULL,
  title text NOT NULL,
  caption text,
  procedure text,
  city text,
  before_path text NOT NULL,
  after_path text NOT NULL,
  months_after integer,
  status text NOT NULL DEFAULT 'draft',
  i18n jsonb NOT NULL DEFAULT '{}'::jsonb
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.before_after_cases TO authenticated;
GRANT SELECT ON public.before_after_cases TO anon;
GRANT ALL ON public.before_after_cases TO service_role;

ALTER TABLE public.before_after_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published before/after cases"
ON public.before_after_cases FOR SELECT TO anon, authenticated
USING (status = 'published');

CREATE POLICY "Admin can manage before/after cases"
ON public.before_after_cases FOR ALL TO authenticated
USING ((auth.jwt() ->> 'email') = 'shijieyuwork@gmail.com')
WITH CHECK ((auth.jwt() ->> 'email') = 'shijieyuwork@gmail.com');

ALTER TABLE public.before_after_cases REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.before_after_cases;