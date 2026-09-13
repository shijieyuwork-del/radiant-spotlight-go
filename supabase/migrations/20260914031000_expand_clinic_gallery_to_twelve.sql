-- Expand the gallery without changing existing photos, ordering or validation rules.
CREATE OR REPLACE FUNCTION public.valid_clinic_photo_gallery(gallery jsonb)
RETURNS boolean LANGUAGE plpgsql IMMUTABLE SET search_path = public AS $$
DECLARE item jsonb;
BEGIN
  IF gallery IS NULL THEN RETURN true; END IF;
  IF jsonb_typeof(gallery) <> 'array' THEN RETURN false; END IF;
  IF jsonb_array_length(gallery) > 12 THEN RETURN false; END IF;
  FOR item IN SELECT value FROM jsonb_array_elements(gallery) LOOP
    IF item = '{"kind":"original"}'::jsonb THEN CONTINUE; END IF;
    IF jsonb_typeof(item) <> 'object'
      OR (item->>'kind') IS DISTINCT FROM 'upload'
      OR jsonb_typeof(item->'path') IS DISTINCT FROM 'string'
      OR length(item->>'path') NOT BETWEEN 1 AND 500
      OR (item->>'path') LIKE '/%'
      OR position('..' in item->>'path') > 0
      OR item - 'kind' - 'path' <> '{}'::jsonb
    THEN RETURN false; END IF;
  END LOOP;
  RETURN true;
END;
$$;

COMMENT ON COLUMN public.clinics.photo_gallery IS
  'Ordered gallery, max 12: {kind:original} or {kind:upload,path:storage_path}. NULL inherits legacy photo; [] removes all photos. First entry is cover.';
