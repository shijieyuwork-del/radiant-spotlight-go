CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  hospital TEXT NOT NULL,
  city TEXT NOT NULL,
  specialties TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT NOT NULL,
  credentials TEXT,
  languages TEXT,
  photo_path TEXT,
  status TEXT NOT NULL DEFAULT 'draft'
);
GRANT SELECT ON public.doctors TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.doctors TO authenticated;
GRANT ALL ON public.doctors TO service_role;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published doctors" ON public.doctors FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "Admin can manage doctors" ON public.doctors FOR ALL TO authenticated USING ((auth.jwt() ->> 'email') = 'shijieyuwork@gmail.com') WITH CHECK ((auth.jwt() ->> 'email') = 'shijieyuwork@gmail.com');

CREATE TABLE public.videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  title TEXT NOT NULL,
  caption TEXT,
  city TEXT,
  procedure TEXT,
  storage_path TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL
);
GRANT SELECT ON public.videos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.videos TO authenticated;
GRANT ALL ON public.videos TO service_role;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published videos" ON public.videos FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "Admin can manage videos" ON public.videos FOR ALL TO authenticated USING ((auth.jwt() ->> 'email') = 'shijieyuwork@gmail.com') WITH CHECK ((auth.jwt() ->> 'email') = 'shijieyuwork@gmail.com');