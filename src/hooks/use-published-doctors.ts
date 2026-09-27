import { useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { signedUrls } from "@/lib/storage-urls";
import { localizeDoctorRow } from "@/lib/i18n-content";
import type { AsiaLang } from "@/lib/asia-i18n";
import { useRealtimeRefresh } from "@/hooks/use-realtime-refresh";

export type PublishedDoctor = {
  id: string; name: string; title: string; city: string; specialties: string[];
  bio: string; photo_path: string | null; created_at?: string; i18n?: unknown;
  photo?: string; demo?: false;
};

const queryKey = ["published-china-doctors"] as const;
const photoKey = ["published-doctor-photos"] as const;
const chinaCities = ["shanghai", "beijing", "guangzhou", "hangzhou", "hainan", "上海", "北京", "广州", "杭州", "海南"];

/** Never substitute sample people for a pending, empty, or failed live response. */
export function usePublishedDoctors(lang: AsiaLang) {
  const queryClient = useQueryClient();
  const doctors = useQuery({
    queryKey,
    staleTime: 60_000,
    queryFn: async ({ signal }) => {
      const { data, error } = await supabase.from("doctors")
        .select("id,name,title,city,specialties,bio,photo_path,created_at,i18n")
        .eq("status", "published")
        .order("created_at", { ascending: false }).order("id", { ascending: true })
        .abortSignal(signal);
      if (error) throw error;
      return ((data ?? []) as PublishedDoctor[])
        .filter((doctor) => chinaCities.some((city) => doctor.city?.toLowerCase().includes(city)));
    },
  });
  const paths = (doctors.data ?? []).map((doctor) => doctor.photo_path);
  const photos = useQuery({
    queryKey: [...photoKey, paths],
    enabled: paths.some(Boolean),
    // The access service signs photos for seven days. Reuse them briefly across routes.
    staleTime: 60 * 60_000,
    queryFn: () => signedUrls("doctor-photos", paths),
  });
  const refresh = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey });
    void queryClient.invalidateQueries({ queryKey: photoKey });
  }, [queryClient]);
  useRealtimeRefresh(["doctors"], refresh);

  const items = useMemo(() => (doctors.data ?? []).map((doctor, index) =>
    localizeDoctorRow({ ...doctor, specialties: doctor.specialties ?? [], photo: photos.data?.[index] ?? "", demo: false as const }, lang)),
  [doctors.data, photos.data, lang]);

  return {
    doctors: items,
    // A background refresh must not hide the same already-loaded doctors again.
    status: doctors.data !== undefined ? "ready" as const : doctors.isError ? "error" as const : "loading" as const,
    refresh,
  };
}
