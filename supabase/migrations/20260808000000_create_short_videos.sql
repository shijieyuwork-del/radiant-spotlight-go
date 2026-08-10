CREATE TABLE public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  caption TEXT,
  city TEXT,
  procedure TEXT,
  storage_path TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published videos are publicly viewable"
  ON public.videos FOR SELECT
  USING (status = 'published' OR (auth.jwt() ->> 'email') = 'shijieyuwork@gmail.com');

CREATE POLICY "Admin can insert videos"
  ON public.videos FOR INSERT TO authenticated
  WITH CHECK ((auth.jwt() ->> 'email') = 'shijieyuwork@gmail.com' AND owner_id = auth.uid());

CREATE POLICY "Admin can update videos"
  ON public.videos FOR UPDATE TO authenticated
  USING ((auth.jwt() ->> 'email') = 'shijieyuwork@gmail.com')
  WITH CHECK ((auth.jwt() ->> 'email') = 'shijieyuwork@gmail.com');

CREATE POLICY "Admin can delete videos"
  ON public.videos FOR DELETE TO authenticated
  USING ((auth.jwt() ->> 'email') = 'shijieyuwork@gmail.com');

CREATE OR REPLACE FUNCTION public.set_video_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER videos_set_updated_at
  BEFORE UPDATE ON public.videos
  FOR EACH ROW EXECUTE FUNCTION public.set_video_updated_at();

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'short-videos',
  'short-videos',
  true,
  104857600,
  ARRAY['video/mp4', 'video/quicktime', 'video/webm']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY "Public can view short videos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'short-videos');

CREATE POLICY "Admin can upload short videos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'short-videos' AND (auth.jwt() ->> 'email') = 'shijieyuwork@gmail.com');

CREATE POLICY "Admin can update short videos"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'short-videos' AND (auth.jwt() ->> 'email') = 'shijieyuwork@gmail.com')
  WITH CHECK (bucket_id = 'short-videos' AND (auth.jwt() ->> 'email') = 'shijieyuwork@gmail.com');

CREATE POLICY "Admin can delete short videos"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'short-videos' AND (auth.jwt() ->> 'email') = 'shijieyuwork@gmail.com');
