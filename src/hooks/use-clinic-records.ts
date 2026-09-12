import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ClinicRecord } from "@/data/clinicDirectory";
import { supabase } from "@/integrations/supabase/client";
import { signedUrls } from "@/lib/storage-urls";
import { useRealtimeRefresh } from "@/hooks/use-realtime-refresh";
import { clinicGalleryPaths, resolveClinicGallery } from "@/lib/clinic-gallery";

export const clinicRecordsQueryKey = ["clinic-records"];

const text = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

/** Published, admin-managed hospital records with signed photo URLs. */
export async function loadClinicRecords(): Promise<ClinicRecord[]> {
  const { data, error } = await supabase
    .from("clinics")
    .select("*")
    .eq("status", "published")
    .order("id");
  if (error) throw new Error("Hospital records could not be loaded.");
  const rows = data ?? [];
  const paths = rows.flatMap((row) => clinicGalleryPaths(row.photo_gallery, row.photo_path));
  const urls = await signedUrls("clinic-photos", paths);
  const byPath = new Map(paths.map((path, index) => [path, urls[index]]));
  return rows.map((row) => ({
    id: row.id,
    staticSlug: text(row.static_slug) || null,
    citySlug: text(row.city_slug),
    nameEn: text(row.name_en),
    nameZh: text(row.name_zh),
    areaEn: text(row.area_en),
    areaZh: text(row.area_zh),
    descriptionEn: text(row.description_en),
    descriptionZh: text(row.description_zh),
    photoUrl: byPath.get(row.photo_path ?? "") ?? "",
    photoGallery: resolveClinicGallery(row.photo_gallery, byPath),
    websiteUrl: text(row.website_url),
    isPublic: Boolean(row.is_public),
    hidden: Boolean(row.hidden),
  }));
}

export function useClinicRecords() {
  const client = useQueryClient();
  const query = useQuery({
    queryKey: clinicRecordsQueryKey,
    queryFn: loadClinicRecords,
    staleTime: 60_000,
    retry: 1,
    enabled: typeof window !== "undefined",
  });
  const refresh = useCallback(() => { void client.invalidateQueries({ queryKey: clinicRecordsQueryKey }); }, [client]);
  useRealtimeRefresh(["clinics"], refresh);
  return { records: query.data ?? [], isLoading: query.isPending, isError: query.isError, refetch: query.refetch };
}
