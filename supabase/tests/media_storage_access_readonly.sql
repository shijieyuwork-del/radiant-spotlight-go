-- Run as the SQL editor's privileged role. Only aggregate reads and transaction-
-- local role/claim changes are performed; no files, records or grants are changed.
BEGIN READ ONLY;
DO $$
DECLARE
  admin_id uuid;
  fake_id uuid := gen_random_uuid();
  expected_count bigint;
  visible_count bigint;
BEGIN
  SELECT id INTO STRICT admin_id FROM auth.users WHERE email='shijieyuwork@gmail.com';
  SELECT count(*) INTO expected_count FROM storage.objects
    WHERE bucket_id IN ('doctor-photos','short-videos','video-covers','before-after','clinic-photos');

  PERFORM set_config('request.jwt.claim.sub','',true);
  PERFORM set_config('request.jwt.claims','{"role":"anon"}',true);
  SET LOCAL ROLE anon;
  SELECT count(*) INTO visible_count FROM storage.objects;
  RESET ROLE;
  IF visible_count <> 0 THEN RAISE EXCEPTION 'Anonymous storage access remains open'; END IF;

  PERFORM set_config('request.jwt.claim.sub',fake_id::text,true);
  PERFORM set_config('request.jwt.claims',jsonb_build_object('sub',fake_id,'role','authenticated','email','storage-audit@example.invalid')::text,true);
  SET LOCAL ROLE authenticated;
  SELECT count(*) INTO visible_count FROM storage.objects;
  RESET ROLE;
  IF visible_count <> 0 THEN RAISE EXCEPTION 'Ordinary account has storage access'; END IF;

  -- Prove that email alone no longer grants storage access without a role tied
  -- to the same JWT subject. This does not create an account or forge a token.
  PERFORM set_config('request.jwt.claims',jsonb_build_object('sub',fake_id,'role','authenticated','email','shijieyuwork@gmail.com')::text,true);
  SET LOCAL ROLE authenticated;
  SELECT count(*) INTO visible_count FROM storage.objects;
  RESET ROLE;
  IF visible_count <> 0 THEN RAISE EXCEPTION 'Admin email alone incorrectly grants access'; END IF;

  PERFORM set_config('request.jwt.claim.sub',admin_id::text,true);
  PERFORM set_config('request.jwt.claims',jsonb_build_object('sub',admin_id,'role','authenticated','email','shijieyuwork@gmail.com')::text,true);
  SET LOCAL ROLE authenticated;
  SELECT count(*) INTO visible_count FROM storage.objects
    WHERE bucket_id IN ('doctor-photos','short-videos','video-covers','before-after','clinic-photos');
  RESET ROLE;
  IF visible_count <> expected_count THEN RAISE EXCEPTION 'Existing administrator lost media access'; END IF;
END;
$$;
ROLLBACK;
SELECT 'PASS: anonymous denied; ordinary account denied; email alone denied; existing administrator retains all media' AS role_verification,
       count(*) AS media_count FROM storage.objects
WHERE bucket_id IN ('doctor-photos','short-videos','video-covers','before-after','clinic-photos');
