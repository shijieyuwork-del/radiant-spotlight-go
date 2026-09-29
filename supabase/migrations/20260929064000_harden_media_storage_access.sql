-- Public media is served exclusively through request-file-access, which checks
-- publication/visibility before issuing signed URLs. Direct client SELECT policies
-- unnecessarily expose object metadata and (for clinics) unpublished photographs.
-- CMS media belongs to the organization, not individual patients. Keep the
-- existing administrator able to manage legacy/service-uploaded files, while
-- requiring BOTH the existing email restriction and a caller-bound admin role.
-- No files, object ownership, user roles or medical records are changed.
BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles r
    JOIN auth.users u ON u.id = r.user_id
    WHERE u.email = 'shijieyuwork@gmail.com' AND r.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Existing media administrator role must be present before hardening storage';
  END IF;
END;
$$;

-- Defense in depth; all five buckets were already private when audited.
UPDATE storage.buckets SET public = false
WHERE id IN ('doctor-photos', 'short-videos', 'video-covers', 'before-after', 'clinic-photos')
  AND public IS DISTINCT FROM false;

DROP POLICY IF EXISTS "Anyone can view clinic photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view published before/after media" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view published video covers" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view published doctor photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view published short videos" ON storage.objects;

-- Also remove older equivalent policy names so replaying the migration cannot
-- leave a permissive policy from an earlier schema alongside the new policies.
DROP POLICY IF EXISTS "Public can view doctor photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view doctor photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view short videos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view short videos" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload doctor photos" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete doctor photos" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload short videos" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update short videos" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete short videos" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload video covers" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update video covers" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete video covers" ON storage.objects;
DROP POLICY IF EXISTS "Admin can manage before/after media" ON storage.objects;
DROP POLICY IF EXISTS "Admin can manage clinic photos" ON storage.objects;
DROP POLICY IF EXISTS "Admin can manage doctor photos" ON storage.objects;
DROP POLICY IF EXISTS "Admin can manage short videos" ON storage.objects;

DO $$
DECLARE
  media_bucket text;
  policy_name text;
BEGIN
  FOREACH media_bucket IN ARRAY ARRAY['doctor-photos', 'short-videos', 'video-covers', 'before-after', 'clinic-photos'] LOOP
    policy_name := 'Verified media administrator: ' || media_bucket;
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', policy_name);
    EXECUTE format($policy$
      CREATE POLICY %I ON storage.objects FOR ALL TO authenticated
      USING (
        bucket_id = %L
        AND (auth.jwt() ->> 'email') = 'shijieyuwork@gmail.com'
        AND EXISTS (
          SELECT 1 FROM public.user_roles AS media_role
          WHERE media_role.user_id = (SELECT auth.uid())
            AND media_role.role = 'admin'::public.app_role
        )
      )
      WITH CHECK (
        bucket_id = %L
        AND (auth.jwt() ->> 'email') = 'shijieyuwork@gmail.com'
        AND EXISTS (
          SELECT 1 FROM public.user_roles AS media_role
          WHERE media_role.user_id = (SELECT auth.uid())
            AND media_role.role = 'admin'::public.app_role
        )
      )
    $policy$, policy_name, media_bucket, media_bucket);
  END LOOP;
END;
$$;

COMMIT;
