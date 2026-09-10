CREATE TABLE public.clinics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  static_slug text UNIQUE,
  city_slug text NOT NULL,
  name_en text NOT NULL DEFAULT '',
  name_zh text NOT NULL DEFAULT '',
  area_en text,
  area_zh text,
  description_en text,
  description_zh text,
  photo_path text,
  is_public boolean NOT NULL DEFAULT false,
  hidden boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.clinics TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clinics TO authenticated;
GRANT ALL ON public.clinics TO service_role;

ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published clinics" ON public.clinics
  FOR SELECT TO anon, authenticated USING (status = 'published');

CREATE POLICY "Admin can manage clinics" ON public.clinics
  FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'email') = 'shijieyuwork@gmail.com')
  WITH CHECK ((auth.jwt() ->> 'email') = 'shijieyuwork@gmail.com');

CREATE TRIGGER clinics_set_updated_at BEFORE UPDATE ON public.clinics
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Anyone can view clinic photos" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'clinic-photos');

CREATE POLICY "Admin can manage clinic photos" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'clinic-photos' AND (auth.jwt() ->> 'email') = 'shijieyuwork@gmail.com')
  WITH CHECK (bucket_id = 'clinic-photos' AND (auth.jwt() ->> 'email') = 'shijieyuwork@gmail.com');