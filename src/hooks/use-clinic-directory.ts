import { useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { mergeClinicDirectory, type PublishedClinicDoctor } from "@/data/clinicDirectory";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeRefresh } from "@/hooks/use-realtime-refresh";

const queryKey = ["clinic-directory-published-doctors"];

async function loadPublishedDoctors(): Promise<PublishedClinicDoctor[]> {
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
  const client = useQueryClient();
  const query = useQuery({
    queryKey,
    queryFn: loadPublishedDoctors,
    staleTime: 60_000,
    retry: 1,
    enabled: typeof window !== "undefined",
  });
  const refresh = useCallback(() => { void client.invalidateQueries({ queryKey }); }, [client]);
  useRealtimeRefresh(["doctors"], refresh);
  const clinics = useMemo(() => mergeClinicDirectory(query.data ?? []), [query.data]);

  return { clinics, doctors: query.data ?? [], isLoading: query.isPending, isError: query.isError, refetch: query.refetch };
}
