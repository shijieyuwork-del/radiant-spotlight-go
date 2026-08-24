-- 1) profiles：SELECT 仅限本人
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- 2) doctor-photos：仅已发布医生的照片可公开读取
DROP POLICY IF EXISTS "Anyone can view doctor photos" ON storage.objects;
CREATE POLICY "Anyone can view published doctor photos"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'doctor-photos'
  AND EXISTS (
    SELECT 1 FROM public.doctors d
    WHERE d.status = 'published' AND d.photo_path = storage.objects.name
  )
);

-- 3) short-videos：仅已发布视频的文件可公开读取
DROP POLICY IF EXISTS "Anyone can view short videos" ON storage.objects;
CREATE POLICY "Anyone can view published short videos"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'short-videos'
  AND EXISTS (
    SELECT 1 FROM public.videos v
    WHERE v.status = 'published' AND v.storage_path = storage.objects.name
  )
);