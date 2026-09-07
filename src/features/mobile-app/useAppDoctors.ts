import { useCallback, useEffect, useState } from "react";
import { useRealtimeRefresh } from "@/hooks/use-realtime-refresh";
import { supabase } from "@/integrations/supabase/client";
import { localizeDoctorRow } from "@/lib/i18n-content";
import { signedUrls } from "@/lib/storage-urls";
import type { AsiaLang } from "@/lib/asia-i18n";
import type { AppDoctor } from "./types";

type PublishedDoctorRow = {
  bio: string;
  city: string;
  i18n: unknown;
  id: string;
  name: string;
  photo_path: string | null;
  specialties: string[];
  title: string;
};

export const useAppDoctors = (lang: AsiaLang) => {
  const [doctors, setDoctors] = useState<AppDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setError(false);
    void supabase
      .from("doctors")
      .select("id,name,title,city,specialties,bio,photo_path,i18n")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .then(async ({ data, error: requestError }) => {
        if (requestError) {
          setError(true);
          setLoading(false);
          return;
        }
        const rows = (data ?? []) as PublishedDoctorRow[];
        const photos = await signedUrls("doctor-photos", rows.map((row) => row.photo_path));
        setDoctors(rows.map((row, index) => {
          const localized = localizeDoctorRow(row, lang);
          return {
            bio: localized.bio ?? "",
            city: localized.city ?? "",
            id: row.id,
            name: localized.name ?? row.name,
            photo: photos[index] ?? "",
            specialties: localized.specialties ?? [],
            title: localized.title ?? row.title,
          };
        }));
        setLoading(false);
      });
  }, [lang]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);
  useRealtimeRefresh(["doctors"], load);

  return { doctors, error, loading, retry: load };
};
