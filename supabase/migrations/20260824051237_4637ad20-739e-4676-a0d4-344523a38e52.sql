ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS cover_path text;

CREATE POLICY "Anyone can view published video covers"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'video-covers'
  AND EXISTS (
    SELECT 1 FROM public.videos v
    WHERE v.status = 'published' AND v.cover_path = storage.objects.name
  )
);

CREATE POLICY "Admin can upload video covers"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'video-covers' AND (auth.jwt() ->> 'email') = 'shijieyuwork@gmail.com');

CREATE POLICY "Admin can update video covers"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'video-covers' AND (auth.jwt() ->> 'email') = 'shijieyuwork@gmail.com')
  WITH CHECK (bucket_id = 'video-covers' AND (auth.jwt() ->> 'email') = 'shijieyuwork@gmail.com');

CREATE POLICY "Admin can delete video covers"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'video-covers' AND (auth.jwt() ->> 'email') = 'shijieyuwork@gmail.com');