CREATE TABLE public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  hospital TEXT NOT NULL,
  city TEXT NOT NULL,
  specialties TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT NOT NULL,
  credentials TEXT,
  languages TEXT,
  photo_path TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published doctors are publicly viewable" ON public.doctors FOR SELECT
  USING (status = 'published' OR (auth.jwt() ->> 'email') = 'shijieyuwork@gmail.com');
CREATE POLICY "Admin can insert doctors" ON public.doctors FOR INSERT TO authenticated
  WITH CHECK ((auth.jwt() ->> 'email') = 'shijieyuwork@gmail.com' AND owner_id = auth.uid());
CREATE POLICY "Admin can update doctors" ON public.doctors FOR UPDATE TO authenticated
  USING ((auth.jwt() ->> 'email') = 'shijieyuwork@gmail.com');
CREATE POLICY "Admin can delete doctors" ON public.doctors FOR DELETE TO authenticated
  USING ((auth.jwt() ->> 'email') = 'shijieyuwork@gmail.com');

ALTER TABLE public.videos ADD COLUMN doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL;
CREATE INDEX videos_doctor_id_idx ON public.videos(doctor_id);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('doctor-photos', 'doctor-photos', true, 10485760, ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Public can view doctor photos" ON storage.objects FOR SELECT USING (bucket_id = 'doctor-photos');
CREATE POLICY "Admin can upload doctor photos" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'doctor-photos' AND (auth.jwt() ->> 'email') = 'shijieyuwork@gmail.com');
CREATE POLICY "Admin can delete doctor photos" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'doctor-photos' AND (auth.jwt() ->> 'email') = 'shijieyuwork@gmail.com');
