CREATE INDEX IF NOT EXISTS videos_status_created_id_idx ON public.videos (status, created_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS videos_placement_idx ON public.videos (placement);