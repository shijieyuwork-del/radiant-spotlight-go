import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { getBrowserClient } from "@/lib/browser-client";
import { usePublicCaseData } from "@/lib/public-case-data";
import { buildTreatmentCities, type TreatmentRecords } from "@/lib/treatment-city-seo";
import type { CaseExpert, PublishedCase } from "@/lib/case-seo";

/** Navigation refreshes public metadata only; never downloads or signs the video library. */
export function useTreatmentRecords() {
  const initial = usePublicCaseData();
  const { pathname } = useLocation();
  const seed = initial?.scopePath === pathname ? initial : undefined;
  const query = useQuery({
    queryKey: ["treatment-public-records"],
    enabled: typeof window !== "undefined",
    staleTime: 60_000,
    queryFn: async ({ signal }) => {
      const client = await getBrowserClient();
      async function rows(table: "videos" | "doctors") {
        const all = [];
        for (let offset = 0; ; offset += 500) {
          const { data, error } = await client.from(table).select("*").eq("status", "published").order("id").range(offset, offset + 499).abortSignal(signal);
          if (error) throw error;
          all.push(...(data ?? []));
          if ((data ?? []).length < 500) return all;
        }
      }
      const [videos, doctors] = await Promise.all([rows("videos"), rows("doctors")]);
      const records: TreatmentRecords = { videos: videos as PublishedCase[], doctors: doctors as CaseExpert[] };
      return { ...records, treatmentCities: buildTreatmentCities(records) };
    },
  });
  return { data: query.data ?? seed, isLoading: !query.data && !seed && query.isLoading, error: query.error };
}
