import { useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { applyClinicRecords, mergeClinicDirectory, type PublishedClinicDoctor } from "@/data/clinicDirectory";
import { useClinicRecords } from "@/hooks/use-clinic-records";
import { getBrowserClient } from "@/lib/browser-client";
import { useRealtimeRefresh } from "@/hooks/use-realtime-refresh";
import { usePublicCaseData } from "@/lib/public-case-data";

const queryKey = ["clinic-directory-published-doctors"];

async function loadPublishedDoctors(): Promise<PublishedClinicDoctor[]> {
  const supabase = await getBrowserClient();
  const { data, error } = await supabase
    .from("doctors")
    .select("id,name,title,hospital,city,i18n")
    .eq("status", "published")
    .order("id");
  if (error) throw new Error("Published hospital profiles could not be loaded.");
  return (data ?? []).filter((row) => row.hospital?.trim() && row.city?.trim()) as PublishedClinicDoctor[];
}

/** Both views use the same public records, identities, and exact hospital matching. */
export function useClinicDirectory() {
  const initial = usePublicCaseData();
  const client = useQueryClient();
  const query = useQuery({
    queryKey,
    initialData: initial?.doctors,
    initialDataUpdatedAt: 0,
    queryFn: loadPublishedDoctors,
    staleTime: 60_000,
    retry: 1,
    enabled: typeof window !== "undefined",
  });
  const refresh = useCallback(() => { void client.invalidateQueries({ queryKey }); }, [client]);
  useRealtimeRefresh(["doctors"], refresh);
  const records = useClinicRecords();
  const clinics = useMemo(
    () => records.isLoading && initial ? initial.clinics : applyClinicRecords(mergeClinicDirectory(query.data ?? []), records.records),
    [query.data, records.records, records.isLoading, initial],
  );

  return {
    clinics,
    doctors: query.data ?? [],
    isLoading: !initial && (query.isPending || records.isLoading),
    isError: query.isError || records.isError,
    refetch: () => { void records.refetch(); return query.refetch(); },
  };
}
