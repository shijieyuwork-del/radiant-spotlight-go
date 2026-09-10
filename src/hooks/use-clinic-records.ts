import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ClinicRecord } from "@/data/clinicDirectory";
import { supabase } from "@/integrations/supabase/client";
import { signedUrls } from "@/lib/storage-urls";
import { useRealtimeRefresh } from "@/hooks/use-realtime-refresh";

export const clinicRecordsQueryKey = ["clinic-records"];

const text = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

/** Published, admin-managed hospital records with signed photo URLs. */
export async function loadClinicRecords(): Promise<ClinicRecord[]> {
  const { data, error } = await supabase
    .from("clinics")
    .select("id,static_slug,city_slug,name_en,name_zh,area_en,area_zh,description_en,description_zh,photo_path,website_url,is_public,hidden,status")
    .eq("status", "published")
    .order("id");
  if (error) throw new Error("Hospital records could not be loaded.");
  const rows = data ?? [];
  const urls = await signedUrls("clinic-photos", rows.map((row) => row.photo_path));
  return rows.map((row, index) => ({
    id: row.id,
    staticSlug: text(row.static_slug) || null,
    citySlug: text(row.city_slug),
    nameEn: text(row.name_en),
    nameZh: text(row.name_zh),
    areaEn: text(row.area_en),
    areaZh: text(row.area_zh),
    descriptionEn: text(row.description_en),
    descriptionZh: text(row.description_zh),
    photoUrl: urls[index] ?? "",
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
